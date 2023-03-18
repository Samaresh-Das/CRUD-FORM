const User = require("../models/Users");
const passport = require("passport");

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const getUserPage = (req, res) => {
  res.render("../views/auth/register");
};

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await new User({ username, email });
    const registerUser = await User.register(user, password);
    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Registration complete");
      res.redirect("/comments");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

const loginPage = (req, res) => {
  res.render("auth/login");
};

const login = (req, res) => {
  req.flash("success", "Welcome back");
  const redirectUrl = req.session.returnTo || "/comments";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

const logoutFunc = (req, res) => {
  req.logout(function (err) {
    //logout always requires a callback function
    if (err) return next(err);
  });
  req.flash("success", "Bye Bye");
  res.redirect("/comments");
};

module.exports = {
  getUserPage,
  signup,
  loginPage,
  login,
  logoutFunc,
};
