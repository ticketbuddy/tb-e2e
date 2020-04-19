import {createPromoter, createActivity, createActivityDate, getAccountActivityDates, getAccountActivityDatesByActivity, signOut, getStarted} from "tb-sdk"
import Joi from "@hapi/joi"

describe("Activity Date", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  it("creates an activity date", () => {
    const createPromoterReq = createPromoter()
    const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)
    const createActivityDateReq = createActivityDate(createActivityReq.body.wish.activity_id)
    cy.execute(createPromoterReq)
    cy.execute(createActivityReq)

    cy.execute(createActivityDateReq)
      .its('body')
      .then((body) => {
        expect(body).to.deep.eq({
          activity_date_id: createActivityDateReq.body.wish.activity_date_id,
          activity_id: createActivityReq.body.wish.activity_id,
          addr_line_1: null,
          addr_line_2: null,
          postcode: null,
          county: null,
          country: null,
          goes_live: null,
          starts: null,
          ends: null
        })
      })

    cy.execute(getAccountActivityDates())
      .its('body')
      .then((body) => {
        expect(body).to.deep.eq({
          [createActivityDateReq.body.wish.activity_date_id]: {
            activity_date_id: createActivityDateReq.body.wish.activity_date_id,
            activity_id: createActivityReq.body.wish.activity_id,
            addr_line_1: null,
            addr_line_2: null,
            postcode: null,
            county: null,
            country: null,
            goes_live: null,
            starts: null,
            ends: null
          }
        })
      })
  })

  it("fetches activity date for account", () => {
    const createPromoterReq = createPromoter()
    const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)
    const createActivityDateReq = createActivityDate(createActivityReq.body.wish.activity_id)
    cy.execute(createPromoterReq)
    cy.execute(createActivityReq)
    cy.execute(createActivityDateReq)

    cy.execute(getAccountActivityDates())
      .its('body')
      .then((body) => {
        expect(body).to.deep.eq({
          [createActivityDateReq.body.wish.activity_date_id]: {
            activity_date_id: createActivityDateReq.body.wish.activity_date_id,
            activity_id: createActivityReq.body.wish.activity_id,
            addr_line_1: null,
            addr_line_2: null,
            postcode: null,
            county: null,
            country: null,
            goes_live: null,
            starts: null,
            ends: null
          }
        })
      })
  })

  it("fetches activity dates for account by activity id", () => {
    const createPromoterReq = createPromoter()
    const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)
    const createActivityDateReq = createActivityDate(createActivityReq.body.wish.activity_id)
    cy.execute(createPromoterReq)
    cy.execute(createActivityReq)
    cy.execute(createActivityDateReq)

    cy.execute(getAccountActivityDatesByActivity(createActivityReq.body.wish.activity_id))
      .its('body')
      .then((body) => {
        expect(body).to.deep.eq({
          [createActivityDateReq.body.wish.activity_date_id]: {
            activity_date_id: createActivityDateReq.body.wish.activity_date_id,
            activity_id: createActivityReq.body.wish.activity_id,
            addr_line_1: null,
            addr_line_2: null,
            postcode: null,
            county: null,
            country: null,
            goes_live: null,
            starts: null,
            ends: null
          }
        })
      })
  })

  it("updates an activity date location")

  it("updates an activity date times")

  it("rejects creating an activity date for an activity which is not owned by the user", () => {
    const createPromoterReq = createPromoter()
    const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)
    const createActivityDateReq = createActivityDate("an-invalid-activity-id")
    cy.execute(createPromoterReq)
    cy.execute(createActivityReq)

    cy.execute(createActivityDateReq)
      .then((req) => {
        expect(req.status).to.eq(403)
      })
  })

  it("rejects updating an activity date which is not owned by the user")
})
