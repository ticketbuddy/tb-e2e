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
        expect(res.body).to.include.keys('basket_id', 'checkout_id', 'items', 'rejected_items', 'person_id')
        expect(res.body.items.length).to.eq(1)
        expect(res.body.rejected_items.length).to.eq(0)
        expect(res.body.items[0]).to.deep.include({
          "product": {
            "amount": 400,
            "title": "Early bird ticket"
          },
          "product_id": createTicketReq.body.wish.product_id,
          "shareholders": [
            {
              "amount": 400,
              "creditor_id": "creditor-one-two-three"
            }
          ]
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
        expect(res.body).to.include.keys('basket_id', 'checkout_id', 'items', 'rejected_items', 'person_id')
        expect(res.body.items.length).to.eq(1)
        expect(res.body.rejected_items.length).to.eq(1)

        expect(res.body.rejected_items[0]).to.deep.eq({
          product: {amount: 400, title: "Early bird ticket"},
          product_id: createTicketReq.body.wish.product_id
        })
      })
  })
})
