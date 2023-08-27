const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../Models/User");
const Post = require("../Models/Post");
const Comment = require("../Models/Comment");
const Reply = require("../Models/Reply");
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
      const userId = req.user._id;
      const {postId, text } = req.body;
    const commentDetails = { text, postId, userid:userId };
    const createComment = await Comment.create(commentDetails);
    const post = await Post.findOne({ _id: postId });
    post.comment.push(createComment._id);
    post.save();
    const postDetails = await Post.findOne({ _id: postId })
      .populate("userid")
      .populate({
        path: "comment",
        populate: {
          path: "userid",
        },
      })
      .populate({
        path: "comment",
        populate: {
          path: "reply",
          populate: {
            path: "replyReplyId",
            populate: {
              path: "userid",
            },
          },
        },
      });
      
      return res.status(200).json(postDetails);
  }
);


router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const commentId = req.body.commentId;
    const comment = await Comment.findByIdAndDelete(commentId);
    return res.status(200).json(comment);
  }
);

router.post(
  "/reply",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user._id;
    const { commentId, text } = req.body;
    const commentDetails = await Comment.findOne({ _id: commentId });
    const replyDetails = { text, commentId, userid: userId };
    const createReply = await Reply.create(replyDetails);
    commentDetails.reply.push(createReply._id);
    commentDetails.save();
    return res.status(200).json(commentDetails);
  }
);

module.exports = router;
