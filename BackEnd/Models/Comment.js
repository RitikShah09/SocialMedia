
var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "" }],
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);