import {createPromoter, getStarted, getAccountPromoters, signOut} from "tb-sdk"
import {createPromoterSchema, accountPromotersSchema} from "../schemas"
import Joi from "@hapi/joi"

describe("Promoter", () => {
  beforeEach(() => {
    cy.execute(signOut())
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
  });

  it("does not show promoters for other accounts", () => {
    cy.execute(createPromoter())

    cy.execute(signOut())

    cy.execute(getStarted())

    const expectedPromoterReq = createPromoter()
    cy.execute(expectedPromoterReq)

    const schema = accountPromotersSchema(expectedPromoterReq.body.wish.promoter_id)

    cy.execute(getAccountPromoters())
    .its('body')
    .then((body) => {
      cy.assertValid(schema, body)
      expect(Object.keys(body)).to.have.length(1)
    })
  })
});
