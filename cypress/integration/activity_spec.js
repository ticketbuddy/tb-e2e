import {createPromoter, createActivity, getStarted, signOut, getAccountActivities, getAccountActivitiesByPromoter} from "tb-sdk"
import {createActivitySchema, getAccountActivitiesSchema} from "../schemas"
import Joi from "@hapi/joi"

describe("Activity", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  it("creates a new activity", () => {
    const createPromoterReq = createPromoter()

    cy.execute(createPromoterReq)

    const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)

    const schema = createActivitySchema(createPromoterReq.body.wish.promoter_id, createActivityReq.body.wish.activity_id);

    cy.execute(createActivityReq)
      .its('body')
      .then((body) => cy.assertValid(schema, body))
  })

  it("fetches all activities for the account", () => {
    const createPromoterReq = createPromoter()
    const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)
    cy.execute(createPromoterReq)
    cy.execute(createActivityReq)

    const schema = getAccountActivitiesSchema(createPromoterReq.body.wish.promoter_id, createActivityReq.body.wish.activity_id);

    cy.execute(getAccountActivities())
      .its('body')
      .then((body) => cy.assertValid(schema, body))
  })

  it("fetches all activities by promoter id", () => {
    const createPromoterReq = createPromoter()
    const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)
    cy.execute(createPromoterReq)
    cy.execute(createActivityReq)

    const schema = getAccountActivitiesSchema(createPromoterReq.body.wish.promoter_id, createActivityReq.body.wish.activity_id);

    cy.execute(getAccountActivitiesByPromoter(createPromoterReq.body.wish.promoter_id))
      .its('body')
      .then((body) => cy.assertValid(schema, body))
  })

  it("rejects activity creation when user does not own promoter")
})
