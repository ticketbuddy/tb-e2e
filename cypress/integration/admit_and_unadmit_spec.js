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

        // verified user
        cy.signInAs("6b54b841c15f4b93add07b0c3f0ce59d")
        cy.execute(reserveSeat(createTicketReq.body.wish.product_id))

        // as promoter id
        cy.signInAs(promoterPersonId)

        cy.execute(admitSeat(seatId))
        .then((req) => {
          expect(req.status).to.eq(200)
          expect(req.body).to.deep.eq({"admitted?": true})
        })

        cy.execute(unAdmitSeat(seatId))
        .then((req) => {
          expect(req.status).to.eq(200)
          expect(req.body).to.deep.eq({"admitted?": false})
        })
      })
  })
})
