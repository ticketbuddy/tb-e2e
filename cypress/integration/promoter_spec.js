import {createPromoter, getStarted, getAccountPromoters} from "tb-sdk"
import Joi from "@hapi/joi"

describe("Promoter", () => {
  beforeEach(() => {
    cy.execute(getStarted())
  })

  it("Creates a new promoter", () => {
    const req = createPromoter();

    const createPromoterSchema = Joi.object({
        promoter_id: req.body.wish.promoter_id,
        account_id: Joi.string().required(),
        title: Joi.string(),
        description: [Joi.string(), Joi.allow(null)]
    });

    cy.execute(req)
      .its('body')
      .then((body) => {
        cy.assertValid(createPromoterSchema, body)
      })
  })

  it("Fetches promoter", () => {
    const createPromoterReq = createPromoter();
    const promoterId = createPromoterReq.body.wish.promoter_id

    const accountPromotersSchema = Joi.object({
      [promoterId]: Joi.object({
          promoter_id: promoterId,
          account_id: Joi.string().required(),
          title: [Joi.string(), Joi.allow(null)],
          description: [Joi.string(), Joi.allow(null)]
      })
    })

    cy.execute(createPromoterReq)

    cy.execute(getAccountPromoters())
    .its('body')
    .then((body) => {
      cy.assertValid(accountPromotersSchema, body)
    })
  })
});
