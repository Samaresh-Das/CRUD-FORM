const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  comments: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comments", commentsSchema);
