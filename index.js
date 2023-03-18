const express = require("express");
const port = 8000;
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const User = require("./models/Users");

const ExpressError = require("./ExpressError");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const userRoutes = require("./routes/user-routes");
const commentsRoutes = require("./routes/comments-routes");

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
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongoose.connect("mongodb://localhost:27017/practiceCrudForm");
mongoose.connect(
  "mongodb+srv://sam679:WVKM5AVgQjVP0Iam@cluster0.cs3a5ei.mongodb.net/form-crud?retryWrites=true&w=majority"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(userRoutes);
app.use(commentsRoutes);

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
