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
const session = require("express-session");

app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));

const sessionConfig = {
  secret: "rjhf3ruihf",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //mili-seconds in a week XD
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

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
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/comments", async (req, res) => {
  const comment = await Comments.find({});
  res.render("comments", { comment });
});

app.post("/comments", validateComment, async (req, res) => {
  const comment = new Comments(req.body.comment);
  await comment.save();
  req.flash("success", "Comment added");
  res.redirect("/comments");
});

app.get("/comments/:id/edit", async (req, res) => {
  //edit comment form
  const { id } = req.params;
  const foundComment = await Comments.findById(id);
  if (!foundComment) {
    return res.redirect("/comments");
  }

  res.render("edit", { foundComment });
});

app.put("/comments/:id", async (req, res) => {
  //edit post
  const { id } = req.params;
  await Comments.findByIdAndUpdate(id, {
    ...req.body.comment,
  });
  res.redirect("/comments");
});

app.delete("/comments/:id", async (req, res) => {
  const { id } = req.params;
  await Comments.findByIdAndDelete(id);
  res.redirect("/comments");
});

app.get("/form", (req, res) => {
  res.render("form");
});

app.all("*", (req, res, next) => {
  //all indicates do this for every single requests and * indicates all paths and also where you declare this matters. I recommend declaring it at last before err func
  next(new ExpressError("Page Not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err; //giving them a default using equals sign
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
