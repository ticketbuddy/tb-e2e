import {getStarted, signOut, createPromoter, createActivity, createActivityDate, createTicket, updateTicket} from "tb-sdk"

describe("Ticket", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  it("creates a ticket for an activity date", () => {
    const createPromoterReq = createPromoter()
    const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)
    const createActivityDateReq = createActivityDate(createActivityReq.body.wish.activity_id)
    const createTicketReq = createTicket(createActivityDateReq.body.wish.activity_date_id)

    cy.execute(createPromoterReq)
    cy.execute(createActivityReq)
    cy.execute(createActivityDateReq)

    cy.execute(createTicketReq)
      .its('body')
      .then((body) => {
        expect(body).to.deep.eq({
          product_id: createTicketReq.body.wish.product_id,
          owning_shelf: createActivityDateReq.body.wish.activity_date_id,
          title: "Untitled",
          shareholders: {},
          quantity: 0
        })
      })
  })

  it("updates a ticket", () => {
    const createPromoterReq = createPromoter()
    const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)
    const createActivityDateReq = createActivityDate(createActivityReq.body.wish.activity_id)
    const createTicketReq = createTicket(createActivityDateReq.body.wish.activity_date_id)

    cy.execute(createPromoterReq)
    cy.execute(createActivityReq)
    cy.execute(createActivityDateReq)
    cy.execute(createTicketReq)

    const updateTicketReq = updateTicket({
      ticketId: createTicketReq.body.wish.product_id,
      title: "Early bird ticket",
      quantity: 200,
      creditorId: "creditor-one-two-three",
      amount: 400
    })

    cy.execute(updateTicketReq)
      .its('body')
      .then((body) => {
        expect(body).to.deep.eq({
          product_id: createTicketReq.body.wish.product_id,
          owning_shelf: createActivityDateReq.body.wish.activity_date_id,
          title: "Early bird ticket",
          quantity: 200,
          shareholders: {
            "creditor-one-two-three": 400
          }
        })
      })
  })

  it("rejects creating a ticket when user is not allowed", () => {
    const createPromoterReq = createPromoter()
    const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)
    const createActivityDateReq = createActivityDate(createActivityReq.body.wish.activity_id)
    const createTicketReq = createTicket("some-other-activity-date")

    cy.execute(createPromoterReq)
    cy.execute(createActivityReq)
    cy.execute(createActivityDateReq)

    cy.execute(createTicketReq)
      .then((req) => {
        expect(req.status).to.eq(403)
      })
  })

  it("rejects updating a ticket when user does not have permission", () => {
    const createPromoterReq = createPromoter()
    const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)
    const createActivityDateReq = createActivityDate(createActivityReq.body.wish.activity_id)
    const createTicketReq = createTicket(createActivityDateReq.body.wish.activity_date_id)

    cy.execute(createPromoterReq)
    cy.execute(createActivityReq)
    cy.execute(createActivityDateReq)
    cy.execute(createTicketReq)

    const updateTicketReq = updateTicket({
      ticketId: "this-is-not-my-ticket",
      title: "Early bird ticket",
      quantity: 200,
      creditorId: "creditor-one-two-three",
      amount: 400
    })

    cy.execute(updateTicketReq)
      .then((req) => {
        expect(req.status).to.eq(403)
      })
  })
})
