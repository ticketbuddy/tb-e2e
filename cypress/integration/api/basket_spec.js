import {startCheckout, getStarted, signOut, createActivityDate, createBasket, getBasket} from "tb-sdk"
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

  it("fetches items in a basket", () => {
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

    const getBasketReq = getBasket(createBasketReq.body.wish.basket_id)
    cy.execute(getBasketReq)
      .then((res) => {
        expect(res.status).to.eq(200)
        const itemReserved = Object.values(res.body)[0]
        expect(itemReserved).to.deep.include({
          amount: 400,
          basket_id: createBasketReq.body.wish.basket_id,
          product_id: createTicketReq.body.wish.product_id,
          shareholders: {"creditor-one-two-three": 400},
          status: "reserved",
          title: "Early bird ticket",
        })
      })
  })

  it("shows items when ask for 2 seats when only 1 is available", () => {
    cy.execute(getStarted())
    const {createTicketReq} = ticketSetup()
    const checkoutAmount = 400

    cy.execute(signOut())
    cy.execute(getStarted())
    cy.upgradeToVerified()

    const createBasketReq = createBasket({
      [createTicketReq.body.wish.product_id]: 2
    })

    cy.execute(createBasketReq)

    const getBasketReq = getBasket(createBasketReq.body.wish.basket_id)
    cy.execute(getBasketReq)
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(Object.keys(res.body)).to.have.length(1)
      })
  })
})
