const mongoose = require('mongoose');

var replySchema = new mongoose.Schema(
  {
    text: String,
    replyReplyId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reply", replySchema);
