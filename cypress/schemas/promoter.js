import Joi from "@hapi/joi"

export const createPromoterSchema = (promoterId) => Joi.object({
    promoter_id: promoterId,
    account_id: Joi.string().required(),
    title: Joi.string(),
    description: Joi.allow(null)
});

export const accountPromotersSchema = (promoterId) => Joi.object({
  [promoterId]: Joi.object({
      promoter_id: promoterId,
      account_id: Joi.string().required(),
      title: Joi.allow(null),
      description: Joi.allow(null)
  })
})
