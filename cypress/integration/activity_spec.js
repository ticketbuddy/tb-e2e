import {createPromoter, createActivity, updateActivity, getStarted, signOut, getAccountActivities, getAccountActivitiesByPromoter} from "tb-sdk"
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

  it("updates an activity", () => {
    const createPromoterReq = createPromoter()
    const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)

    const updateActivityReq = updateActivity({activityId: createActivityReq.body.wish.activity_id,
      title: "My launch event",
      description: "A very very\n\nlong description!"
    })

    cy.execute(createPromoterReq)
    cy.execute(createActivityReq)
    cy.execute(updateActivityReq)
      .its('body')
      .then((body) => {
        expect(body).to.deep.eq({
          promoter_id: createPromoterReq.body.wish.promoter_id,
          activity_id: createActivityReq.body.wish.activity_id,
          title: "My launch event",
          description: "A very very\n\nlong description!"
        })
      })

    cy.execute(getAccountActivities())
      .its('body')
      .then((body) => {
        expect(body).to.deep.eq({
          [createActivityReq.body.wish.activity_id]: {
            promoter_id: createPromoterReq.body.wish.promoter_id,
            activity_id: createActivityReq.body.wish.activity_id,
            title: "My launch event",
            description: "A very very\n\nlong description!"
          }
        })
      })
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

  it("rejects activity creation when user does not own promoter", () => {
    const createPromoterReq = createPromoter()
    const createActivityReq = createActivity("some-other-promoter-id")
    cy.execute(createPromoterReq)

    cy.execute(createActivityReq)
      .then((req) => {
        expect(req.status).to.eq(403)
      })
  })

  it("rejects fetching activities for a promoter the account does not own")

  it("rejects updating an activity which is not owned", () => {
    const createPromoterReq = createPromoter()
    const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)

    const updateActivityReq = updateActivity({activityId: "some-other-activity",
      title: "My launch event",
      description: "A very very\n\nlong description!"
    })

    cy.execute(createPromoterReq)
    cy.execute(createActivityReq)
    cy.execute(updateActivityReq)
      .then((req) => {
        expect(req.status).to.eq(403)
      })
  })
})
