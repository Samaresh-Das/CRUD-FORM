const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const validateComment = require("../middleware/validateComment");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", commentsController.indexPage);

router.get("/comments", commentsController.commentsPage);

router.get("/form", isLoggedIn, commentsController.createCommentsPage);

router.post(
  "/comments",
  isLoggedIn,
  validateComment,
  commentsController.createComments
);

router.get("/comments/:id/edit", isLoggedIn, commentsController.getCommentById);

router.put("/comments/:id", isLoggedIn, commentsController.editCommentById);

router.delete(
  "/comments/:id",
  isLoggedIn,
  commentsController.deleteCommentById
);

module.exports = router;
