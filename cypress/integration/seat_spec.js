import {getStarted, signOut, createPromoter, createActivity, createActivityDate, createTicket, updateTicket, reserveSeat, getReservedSeats} from "tb-sdk"
import {productIdToItemId} from "../support/helpers"

function ticketSetup(quantity = 1) {
  const createPromoterReq = createPromoter()
  const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)
  const createActivityDateReq = createActivityDate(createActivityReq.body.wish.activity_id)
  const createTicketReq = createTicket(createActivityDateReq.body.wish.activity_date_id)
  const updateTicketReq = updateTicket({
    ticketId: createTicketReq.body.wish.product_id,
    title: "Early bird ticket",
    quantity: quantity,
    creditorId: "creditor-one-two-three",
    amount: 400
  })

  cy.execute(createPromoterReq)
  cy.execute(createActivityReq)
  cy.execute(createActivityDateReq)
  cy.execute(createTicketReq)
  cy.execute(updateTicketReq)

  return {createTicketReq, createActivityDateReq}
}

describe("Seat", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  it("reserves a seat", () => {
    const {createTicketReq} = ticketSetup()

    // verified user
    cy.signInAs("6b54b841c15f4b93add07b0c3f0ce59d")

    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    cy.execute(reserveSeatReq)
      .then((req) => {
        expect(req.status).to.eq(200)

        expect(req.body).to.deep.eq({
          product_id: createTicketReq.body.wish.product_id,
          item_id: productIdToItemId(createTicketReq.body.wish.product_id, 1),
          customer_id: "6b54b841c15f4b93add07b0c3f0ce59d",
          title: "Early bird ticket",
          shareholders: {"creditor-one-two-three": 400},
          state: "reserved"
        })
      })
  })

  it("fetches a user's reserved seats", () => {
    const {createTicketReq, createActivityDateReq} = ticketSetup()

    // verified user
    cy.signInAs("6b54b841c15f4b93add07b0c3f0ce59d")

    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    cy.execute(reserveSeatReq)

    const expectedItemId = productIdToItemId(createTicketReq.body.wish.product_id, 1)

    cy.execute(getReservedSeats())
      .its('body')
      .then((body) => {
        expect(body).to.deep.include({
          [expectedItemId]: {
            amount: 400,
            customer_id: "6b54b841c15f4b93add07b0c3f0ce59d",
            item_id: expectedItemId,
            owning_shelf: createActivityDateReq.body.wish.activity_date_id,
            product_id: createTicketReq.body.wish.product_id,
            status: "reserved",
            title: "Early bird ticket",
            shareholders: {"creditor-one-two-three": 400}
          }
        })
      })
  })

  it("rejects when no seats are available", () => {
    const {createTicketReq} = ticketSetup(0)

    // verified user
    cy.signInAs("6b54b841c15f4b93add07b0c3f0ce59d")

    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    cy.execute(reserveSeatReq)
      .then((req) => {
        expect(req.status).to.eq(400)

        expect(req.body).to.deep.eq({
          status: "Sold out"
        })
      })
  })

  it("rejects when the ticket does not exist", () => {
    const {createTicketReq} = ticketSetup()

    // verified user
    cy.signInAs("6b54b841c15f4b93add07b0c3f0ce59d")

    const reserveSeatReq = reserveSeat("this-ticket-does-not-exist")
    cy.execute(reserveSeatReq)
      .then((req) => {
        expect(req.status).to.eq(400)

        expect(req.body).to.deep.eq({
          status: "No product exists."
        })
      })
  })

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
