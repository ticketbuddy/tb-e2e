import {startCheckout, getStarted, signOut, createPromoter, createActivity, createActivityDate, createTicket, updateTicket, reserveSeat, getReservedSeats} from "tb-sdk"

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
    const expectedSeatId = createTicketReq.body.wish.product_id + ".1"
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

  it("prevents you starting a checkout when items do not match those on the server")

  it("prevents you starting a checkout when the total amount does not match that calculated on the server")
})
