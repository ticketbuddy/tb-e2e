import {getStarted, signOut, createPromoter, createActivity, createActivityDate, createTicket, updateTicket, reserveSeat} from "tb-sdk"

function ticketSetup() {
  const createPromoterReq = createPromoter()
  const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)
  const createActivityDateReq = createActivityDate(createActivityReq.body.wish.activity_id)
  const createTicketReq = createTicket(createActivityDateReq.body.wish.activity_date_id)
  const updateTicketReq = updateTicket({
    ticketId: createTicketReq.body.wish.product_id,
    title: "Early bird ticket",
    quantity: 1,
    creditorId: "creditor-one-two-three",
    amount: 400
  })

  cy.execute(createPromoterReq)
  cy.execute(createActivityReq)
  cy.execute(createActivityDateReq)
  cy.execute(createTicketReq)
  cy.execute(updateTicketReq)

  return {createTicketReq}
}

describe("Seat", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  it("reserves a seat", () => {
    const {createTicketReq} = ticketSetup()

    // verified user
    cy.signInAs("6b54b841-c15f-4b93-add0-7b0c3f0ce59d")

    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    cy.execute(reserveSeatReq)
      .then((req) => {
        expect(req.status).to.eq(200)

        expect(req.body).to.deep.eq({
          product_id: createTicketReq.body.wish.product_id,
          item_id: createTicketReq.body.wish.product_id + ".0",
          customer_id: "6b54b841-c15f-4b93-add0-7b0c3f0ce59d",
          title: "Early bird ticket",
          shareholders: {"creditor-one-two-three": 400},
          state: "reserved"
        })
      })
  })

  it("rejects when no seats are available")

  it("rejects when the ticket does not exist")

  it("rejects anonymous users", () => {
    cy.execute(signOut())
    const {createTicketReq} = ticketSetup()

    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    cy.execute(reserveSeatReq)
      .then((req) => {
        expect(req.status).to.eq(403)
      })
  })

  it("rejects tracked anonymous users", () => {
    const {createTicketReq} = ticketSetup()

    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    cy.execute(reserveSeatReq)
      .then((req) => {
        expect(req.status).to.eq(403)
      })
  })
})
