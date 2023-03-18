const { commentsJoiSchema } = require("../commentsJOI");

const validateComment = (req, res, next) => {
  const { error } = commentsJoiSchema.validate(req.body); //passing the data through schema for validation
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports = validateComment;
