import {startCheckout, getStarted, signOut, createActivityDate, createBasket, getReservedSeats} from "tb-sdk"
import {productIdToItemId, ticketSetup} from "../../support/helpers"

beforeEach(() => {
  cy.execute(signOut())
})

describe("Basket", () => {

  it("allows you to create a basket", () => {
    cy.execute(getStarted())
    const {createTicketReq} = ticketSetup()
    const checkoutAmount = 400

    cy.execute(signOut())
    cy.execute(getStarted())
    cy.upgradeToVerified()

    const createBasketReq = createBasket({
      [createTicketReq.body.wish.product_id]: 1
    })

    cy.execute(createBasketReq)
      .then(res => {
        expect(res.status).to.eq(200)
        expect(res.body).to.deep.eq({
          basket_id: createBasketReq.body.wish.basket_id,
          checkout_id: createBasketReq.body.wish.checkout_id,
          reserved_items: {},
          state: "pending"
        })
      })
  })
})
