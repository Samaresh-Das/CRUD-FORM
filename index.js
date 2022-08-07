const express = require("express");
const port = 8000;
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const Comments = require("./models/Comments");
const { commentsJoiSchema } = require("./commentsJOI");
const ExpressError = require("./ExpressError");

app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect("mongodb://localhost:27017/practiceCrudForm");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const validateComment = (req, res, next) => {
  const { error } = commentsJoiSchema.validate(req.body); //passing the data through schema for validation
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/comments", async (req, res) => {
  const comment = await Comments.find({});
  res.render("comments", { comment });
});

app.post("/comments", async (req, res) => {
  const comment = new Comments(req.body.comment);
  await comment.save();
  res.redirect("/comments");
});

app.get("/form", (req, res) => {
  res.render("form");
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
