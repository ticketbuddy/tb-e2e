import {startCheckout, getStarted, signOut, createPromoter, createActivity, createActivityDate, createTicket, updateTicket, reserveSeat, getReservedSeats} from "tb-sdk"

export const productIdToItemId = (productId, item_number) => "item_" + productId.replace("product_", "") + `.${item_number}`
export const accountIdToCreditorId = (accountId) => accountId.replace("account_", "creditor_")

export const ticketSetup = (quantity = 1) => {
  const createPromoterReq = createPromoter()
  const createActivityReq = createActivity(createPromoterReq.body.wish.promoter_id)
  const createActivityDateReq = createActivityDate(createActivityReq.body.wish.activity_id)
  const createTicketReq = createTicket(createActivityDateReq.body.wish.activity_date_id)
  const updateTicketReq = updateTicket({
    ticketId: createTicketReq.body.wish.product_id,
    title: "Early bird ticket",
    quantity: quantity,
    creditorId: "creditor-one-two-three",
    amount: 400
  })

  cy.execute(createPromoterReq)
  cy.execute(createActivityReq)
  cy.execute(createActivityDateReq)
  cy.execute(createTicketReq)
  cy.execute(updateTicketReq)

  return {createTicketReq, createActivityDateReq}
}

export const makeId = (length) => {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
