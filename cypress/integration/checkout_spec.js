import {startCheckout, getStarted, signOut, createPromoter, createActivity, createActivityDate, createTicket, updateTicket, reserveSeat, getReservedSeats} from "tb-sdk"
import {productIdToItemId} from "../support/helpers"

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

  return {createTicketReq, createActivityDateReq}
}

describe("Checkout", () => {
  beforeEach(() => {
    cy.execute(signOut())
  })

  it("allows you to start a checkout", () => {
    cy.execute(getStarted())
    const {createTicketReq} = ticketSetup()
    const expectedSeatId = productIdToItemId(createTicketReq.body.wish.product_id, 1)
    const checkoutAmount = 400

    cy.execute(signOut())
    cy.execute(getStarted())
    cy.upgradeToVerified()

    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    cy.execute(reserveSeatReq)

    const startCheckoutReq = startCheckout([expectedSeatId], checkoutAmount)

    cy.execute(startCheckoutReq)
      .then((req) => {
        expect(req.status).to.deep.eq(200)
        expect(req.body).to.deep.include({
          checkout_id: startCheckoutReq.body.content.checkout_id,
          payout_directive: {"creditor-one-two-three": checkoutAmount},
          items: [expectedSeatId],
          "completed?": false
        })
      })
  })

  it("prevents you starting a checkout when items do not match those on the server", () => {
    cy.execute(getStarted())
    const {createTicketReq, createActivityDateReq} = ticketSetup()
    const wrongSeatId = "this-is-so-wrong.1"
    const correctSeatId = productIdToItemId(createTicketReq.body.wish.product_id, 1)
    const checkoutAmount = 400

    cy.execute(signOut())
    cy.execute(getStarted())
    cy.upgradeToVerified()

    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    cy.execute(reserveSeatReq)

    const startCheckoutReq = startCheckout([wrongSeatId], checkoutAmount)

    cy.execute(startCheckoutReq)
      .then((req) => {
        expect(req.status).to.deep.eq(400)
        expect(req.body[correctSeatId]).to.deep.include({
          amount: 400,
          item_id: correctSeatId,
          owning_shelf: createActivityDateReq.body.wish.activity_date_id,
          product_id: createTicketReq.body.wish.product_id,
          shareholders: {"creditor-one-two-three": 400},
          status: "reserved",
          title: "Early bird ticket"
        })
      })
  })

  it("prevents you starting a checkout when the total amount does not match that calculated on the server", () => {
    cy.execute(getStarted())
    const {createTicketReq, createActivityDateReq} = ticketSetup()
    const seatId = productIdToItemId(createTicketReq.body.wish.product_id, 1)
    const wrongCheckoutAmount = 399
    const correctCheckoutAmount = 400

    cy.execute(signOut())
    cy.execute(getStarted())
    cy.upgradeToVerified()

    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    cy.execute(reserveSeatReq)

    const startCheckoutReq = startCheckout([seatId], wrongCheckoutAmount)

    cy.execute(startCheckoutReq)
      .then((req) => {
        expect(req.status).to.deep.eq(400)
        expect(req.body[seatId]).to.deep.include({
          amount: 400,
          item_id: seatId,
          owning_shelf: createActivityDateReq.body.wish.activity_date_id,
          product_id: createTicketReq.body.wish.product_id,
          shareholders: {"creditor-one-two-three": correctCheckoutAmount},
          status: "reserved",
          title: "Early bird ticket"
        })
      })
  })
})
