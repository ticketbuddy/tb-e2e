import {getStarted, getCurrentPerson, admitSeat, unAdmitSeat, reserveSeat, signOut} from "tb-sdk"
import {ticketSetup} from "../support/helpers"

describe("Admit and un-admit seats", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  it("admits & unadmits a reserved ticket", () => {
    const {createTicketReq} = ticketSetup()
    const seatId = createTicketReq.body.wish.product_id + ".1"

    cy.execute(getCurrentPerson())
      .then((req) => {
        const promoterPersonId = req.body.person_id
        cy.upgradeToVerified()

        cy.secureSign(seatId)
          .then((entryCode) => {
            // verified user to reserve the seat
            cy.signInAs("6b54b841c15f4b93add07b0c3f0ce59d")
            cy.execute(reserveSeat(createTicketReq.body.wish.product_id))

            // as promoter id to admit & unadmit the ticket
            cy.signInAs(promoterPersonId)

            cy.execute(admitSeat(entryCode))
            .then((req) => {
              expect(req.status).to.eq(200)
              expect(req.body).to.deep.eq({"admitted?": true})
            })

            cy.execute(unAdmitSeat(entryCode))
            .then((req) => {
              expect(req.status).to.eq(200)
              expect(req.body).to.deep.eq({"admitted?": false})
            })
          })
      })
  })

  it("rejects invalid signed seat id", () => {
    const {createTicketReq} = ticketSetup()
    const seatId = createTicketReq.body.wish.product_id + ".1"
    const entryCode = "this-is-not-valid"

    cy.execute(getCurrentPerson())
      .then((req) => {
        const promoterPersonId = req.body.person_id
        cy.upgradeToVerified()

            // verified user to reserve the seat
            cy.signInAs("6b54b841c15f4b93add07b0c3f0ce59d")
            cy.execute(reserveSeat(createTicketReq.body.wish.product_id))

            // as promoter id to admit & unadmit the ticket
            cy.signInAs(promoterPersonId)

            cy.execute(admitSeat(entryCode))
            .then((req) => {
              expect(req.status).to.eq(403)
              expect(req.body).to.deep.eq({
                status: "Invalid seat signature."
              })
            })

            cy.execute(unAdmitSeat(entryCode))
            .then((req) => {
              expect(req.status).to.eq(403)
              expect(req.body).to.deep.eq({
                status: "Invalid seat signature."
              })
            })
      })
  })

  it("rejects unauthorised verified user admitting seats", () => {
    const {createTicketReq} = ticketSetup()
    const seatId = createTicketReq.body.wish.product_id + ".1"

    cy.execute(getCurrentPerson())
      .then((req) => {
        const promoterPersonId = req.body.person_id
        cy.upgradeToVerified()

        cy.secureSign(seatId)
          .then((entryCode) => {
            // verified user to reserve the seat
            cy.signInAs("6b54b841c15f4b93add07b0c3f0ce59d")
            cy.execute(reserveSeat(createTicketReq.body.wish.product_id))

            // as random verified user
            cy.execute(signOut())
            cy.execute(getStarted())
            cy.upgradeToVerified()

            cy.execute(admitSeat(entryCode))
            .then((req) => {
              expect(req.status).to.eq(403)
              expect(req.body).to.deep.eq({
                status: "Not authorised to manage this seat."
              })
            })

            cy.execute(unAdmitSeat(entryCode))
            .then((req) => {
              expect(req.status).to.eq(403)
              expect(req.body).to.deep.eq({
                status: "Not authorised to manage this seat."
              })
            })
          })
      })
  })

  it("fetches admission history for a seat")
})
