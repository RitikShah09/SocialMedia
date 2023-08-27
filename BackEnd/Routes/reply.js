const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../Models/User");
const Comment = require('../Models/Comment');
const Reply = require("../Models/Reply");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user._id;
    const { commentId, text } = req.body;
    const commentDetails = await Comment.findOne({ _id: commentId });
    const replyDetails = { text, commentId, userid: userId };
    const createReply = await Reply.create(replyDetails);
    commentDetails.reply.push(createReply._id);
    commentDetails.save();
      console.log(commentDetails);
    return res.status(200).json(createReply);
  }
);

router.post(
  "/reply",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user._id;
    const { replyId, text } = req.body;
    const replyDetails = await Reply.findOne({ _id: replyId });
    const replyReplyDetails = { text, replyId, userid: userId };
    const replyReplyCreated = await Reply.create(replyReplyDetails);
    replyDetails.replyReplyId.push(replyReplyCreated._id);
    replyDetails.save();
    console.log(replyDetails);
    return res.status(200).json(replyReplyCreated);
  }
);


module.exports = router;
