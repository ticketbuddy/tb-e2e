import {createPromoter, getStarted, getAccountPromoters} from "tb-sdk"
import {createPromoterSchema, accountPromotersSchema} from "../schemas"
import Joi from "@hapi/joi"

describe("Promoter", () => {
  beforeEach(() => {
    cy.execute(getStarted())
  })

  it("Creates a new promoter", () => {
    const req = createPromoter();
    const schema = createPromoterSchema(req.body.wish.promoter_id);

    cy.execute(req)
      .its('body')
      .then((body) => cy.assertValid(schema, body))
  })

  it("Fetches promoter", () => {
    const createPromoterReq = createPromoter();
    const schema = accountPromotersSchema(createPromoterReq.body.wish.promoter_id)

    cy.execute(createPromoterReq)

    cy.execute(getAccountPromoters())
    .its('body')
    .then((body) => cy.assertValid(schema, body))
  })
});
