import {createPromoter, getStarted} from "tb-sdk"
import { assertSchema } from '@cypress/schema-tools'
import { api } from '../../dist-schemas'

describe("Promoter", () => {
  it("Creates a new promoter", () => {

    cy.execute(getStarted())

    cy.execute(createPromoter())
      .its('body')
      .then(api.assertSchema('CreatePromoter', '1.0.0'))
  })
})
