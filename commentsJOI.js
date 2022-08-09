const Joi = require("joi");

module.exports.commentsJoiSchema = Joi.object({
  comment: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    comments: Joi.string().required(),
  }).required(),
});
