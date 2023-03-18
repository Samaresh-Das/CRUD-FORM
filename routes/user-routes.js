const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");

router.get("/register", userController.getUserPage);

router.post("/register", userController.signup);

router.get("/login", userController.loginPage);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/comments",
    failureFlash: true,
    failureRedirect: "/login",
  }),
  userController.login
);

router.get("/logout", userController.logoutFunc);

module.exports = router;
