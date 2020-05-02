import {getStarted, signOut, getCurrentPerson, updatePerson, signIn} from "tb-sdk"
import {makeId} from "../../support/helpers"

describe("Update person", () => {
  beforeEach(() => {
    cy.execute(signOut())
    cy.execute(getStarted())
  })

  it("updates person's email", () => {
    const email = makeId(30) + "@ticketbuddy.co.uk"
    const password = ""

    cy.execute(getCurrentPerson())
      .then(({body}) => {
        const personId = body.person_id;

        cy.execute(updatePerson(email, password))
          .then((req) => {
            expect(req.status).to.eq(200)
            expect(req.body).to.deep.eq({
              person: {
                email: email,
                "email_verified?": false,
                id: personId,
                "is_anonymous?": false,
                name: null,
                terms_and_conditions_agreement_version: 0,
              }
            })
            expect(req.headers).to.include.key('set-cookie')
          })
      })
  })

  it("updates person's password", () => {
    const email = makeId(30) + "@ticketbuddy.co.uk"
    const password = "alongpass12345"

    cy.execute(signIn(email, password))
      .then((req) => { expect(req.status).to.eq(403) })

    cy.execute(updatePerson(email, password))

    cy.execute(signIn(email, password))
      .then((req) => { expect(req.status).to.eq(200) })
  })

  it("rejects password when too short", () => {
    const email = makeId(30) + "@ticketbuddy.co.uk"
    const password = "shrt"

    cy.execute(updatePerson(email, password))
      .then((req) => {
        expect(req.status).to.eq(400)
        expect(req.body).to.deep.eq({
          password: ["should be at least 8 character(s)"]
        })
      })
  })

  it("rejects email when invalid", () => {
    const invalidEmail = makeId(30)
    const password = ""

    cy.execute(updatePerson(invalidEmail, password))
      .then((req) => {
        expect(req.status).to.eq(400)
        expect(req.body).to.deep.eq({
          email: ["has invalid format"]
        })
      })
  })

  it("rejects email when already in-use", () => {
    const alreadyUsedEmail = "tester@ticketbuddy.co.uk"
    const password = ""

    cy.execute(updatePerson(alreadyUsedEmail, password))
      .then((req) => {
        expect(req.status).to.eq(400)
        expect(req.body).to.deep.eq({
          email: ["has already been taken"]
        })
      })
  })

  it("rejects anonymous user", () => {
    cy.execute(signOut())

    const email = makeId(30) + "@ticketbuddy.co.uk"
    const password = "alongpassword"

    cy.execute(updatePerson(email, password))
      .then((req) => {
        expect(req.status).to.eq(403)
      })
  })
})
