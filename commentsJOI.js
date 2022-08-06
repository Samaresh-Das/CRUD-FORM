const Joi = require("joi");

module.exports.commentsJoiSchema = Joi.object({
  comments: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    comment: Joi.string().required(),
  }).required(),
});
