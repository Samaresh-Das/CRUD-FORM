const Comments = require("../models/Comments");

const indexPage = (req, res) => {
  res.render("index");
};

const commentsPage = async (req, res) => {
  const comment = await Comments.find({});
  res.render("comments", { comment });
};

const createCommentsPage = (req, res) => {
  res.render("form");
};

const createComments = async (req, res) => {
  const comment = new Comments(req.body.comment);
  await comment.save();
  req.flash("success", "Comment added");
  res.redirect("/comments");
};

const getCommentById = async (req, res) => {
  //edit comment form
  const { id } = req.params;
  const foundComment = await Comments.findById(id);
  if (!foundComment) {
    return res.redirect("/comments");
  }

  res.render("edit", { foundComment });
};

const editCommentById = async (req, res) => {
  //edit post
  const { id } = req.params;
  await Comments.findByIdAndUpdate(id, {
    ...req.body.comment,
  });
  res.redirect("/comments");
};

const deleteCommentById = async (req, res) => {
  const { id } = req.params;
  await Comments.findByIdAndDelete(id);
  res.redirect("/comments");
};

module.exports = {
  indexPage,
  commentsPage,
  createCommentsPage,
  createComments,
  getCommentById,
  editCommentById,
  deleteCommentById,
};
