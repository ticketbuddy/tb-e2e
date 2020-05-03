import {startCheckout, getStarted, signOut, createActivityDate, reserveSeat, getReservedSeats, getCompletedSeats} from "tb-sdk"
import {productIdToItemId, ticketSetup} from "../../support/helpers"

beforeEach(() => {
  cy.execute(signOut())
})

describe("Checkout", () => {
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

  it("fetches completed seats for a person", () => {
    cy.execute(getStarted())
    const {createTicketReq, createActivityDateReq} = ticketSetup()
    const expectedSeatId = productIdToItemId(createTicketReq.body.wish.product_id, 1)
    const checkoutAmount = 400
    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    const startCheckoutReq = startCheckout([expectedSeatId], checkoutAmount)
    cy.execute(signOut())
    cy.execute(getStarted())
    cy.upgradeToVerified()
    cy.execute(reserveSeatReq)
    cy.execute(startCheckoutReq)
    cy.completeCheckout(startCheckoutReq.body.content.checkout_id)

    cy.execute(getCompletedSeats())
    .then((req) => {
      expect(req.status).to.deep.eq(200)
      expect(req.body[expectedSeatId]).to.deep.include({
          amount: 400,
          item_id: expectedSeatId,
          owning_shelf: createActivityDateReq.body.wish.activity_date_id,
          product_id: createTicketReq.body.wish.product_id,
          shareholders: {"creditor-one-two-three": 400},
          status: "completed",
          title: "Early bird ticket"
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

describe("complete checkout (using debug endpoint to test response to stripe)", () => {
  it("completes a checkout", () => {
    cy.execute(getStarted())
    const {createTicketReq} = ticketSetup()
    const expectedSeatId = productIdToItemId(createTicketReq.body.wish.product_id, 1)
    const checkoutAmount = 400
    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    const startCheckoutReq = startCheckout([expectedSeatId], checkoutAmount)
    cy.execute(signOut())
    cy.execute(getStarted())
    cy.upgradeToVerified()
    cy.execute(reserveSeatReq)
    cy.execute(startCheckoutReq)

    cy.completeCheckout(startCheckoutReq.body.content.checkout_id)
      .then((req) => {
        expect(req.status).to.eq(200)
        expect(req.body).to.deep.eq({})
      })
  })

  it("when a checkout has already been completed", () => {
    cy.execute(getStarted())
    const {createTicketReq} = ticketSetup()
    const expectedSeatId = productIdToItemId(createTicketReq.body.wish.product_id, 1)
    const checkoutAmount = 400
    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    const startCheckoutReq = startCheckout([expectedSeatId], checkoutAmount)
    cy.execute(signOut())
    cy.execute(getStarted())
    cy.upgradeToVerified()
    cy.execute(reserveSeatReq)
    cy.execute(startCheckoutReq)

    // complete checkout first time
    cy.completeCheckout(startCheckoutReq.body.content.checkout_id)

    // respond with 200 when the checkout is already completed
    cy.completeCheckout(startCheckoutReq.body.content.checkout_id)
      .then((req) => {
        expect(req.status).to.eq(200)
        expect(req.body).to.deep.eq({})
      })
  })

  it("rejects completing a checkout that has an invalid checkout id", () => {
    cy.execute(getStarted())
    const {createTicketReq} = ticketSetup()
    const expectedSeatId = productIdToItemId(createTicketReq.body.wish.product_id, 1)
    const checkoutAmount = 400
    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    const startCheckoutReq = startCheckout([expectedSeatId], checkoutAmount)
    cy.execute(signOut())
    cy.execute(getStarted())
    cy.upgradeToVerified()
    cy.execute(reserveSeatReq)
    cy.execute(startCheckoutReq)

    cy.completeCheckout("invalid-checkout-id")
      .then((req) => {
        expect(req.status).to.eq(400)
        expect(req.body).to.deep.eq({})
      })
  })

  it("rejects completing a checkout that doesnt exist (uses debug endpoint)", () => {
    cy.execute(getStarted())
    const {createTicketReq} = ticketSetup()
    const expectedSeatId = productIdToItemId(createTicketReq.body.wish.product_id, 1)
    const checkoutAmount = 400
    const reserveSeatReq = reserveSeat(createTicketReq.body.wish.product_id)
    const startCheckoutReq = startCheckout([expectedSeatId], checkoutAmount)
    cy.execute(signOut())
    cy.execute(getStarted())
    cy.upgradeToVerified()
    cy.execute(reserveSeatReq)
    cy.execute(startCheckoutReq)

    cy.completeCheckout("checkout_woah-i-dont-exist-woah-i-dont-exist-woah-i-dont-exist")
      .then((req) => {
        expect(req.status).to.eq(400)
        expect(req.body).to.deep.eq({})
      })
  })
})