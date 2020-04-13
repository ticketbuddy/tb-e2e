import {createPromoter, createActivity, getStarted, signOut} from "tb-sdk"
import {createActivitySchema} from "../schemas"
import Joi from "@hapi/joi"

describe("Activity", () => {
  beforeEach(() => {
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
})
