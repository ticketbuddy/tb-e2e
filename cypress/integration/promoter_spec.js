import {createPromoter, getStarted, getAccountPromoters, signOut, updatePromoter} from "tb-sdk"
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

  it("updates a promoter", () => {
    const createPromoterReq = createPromoter();
    const updatePromoterReq = updatePromoter({
      promoter_id: createPromoterReq.body.wish.promoter_id,
      title: "A new promoter",
      description: "A description",
    });
    cy.execute(createPromoterReq)
    cy.execute(updatePromoterReq)
      .then((req) => {
        expect(req.status).to.eq(200)
        expect(req.body).to.include({
          promoter_id: createPromoterReq.body.wish.promoter_id,
          description: "A description",
          title: "A new promoter"
        })
      })
  })

  it("rejects updating a promoter if permission denied", () => {
    const createPromoterReq = createPromoter();
    const updatePromoterReq = updatePromoter({
      promoter_id: "some-other-promoter",
      title: "A new promoter",
      description: "A description",
    });
    cy.execute(createPromoterReq)
    cy.execute(updatePromoterReq)
      .then((req) => {
        expect(req.status).to.eq(403)
        expect(req.body).to.include({})
      })
  })
});
