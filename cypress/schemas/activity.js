import Joi from "@hapi/joi"

export const createActivitySchema = (promoterId, activityId) => Joi.object({
    promoter_id: promoterId,
    activity_id: activityId,
    title: Joi.string(),
    description: Joi.allow(null)
});
