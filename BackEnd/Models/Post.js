var mongoose = require("mongoose");

var postSchema = new mongoose.Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    Ext: String,
    public_id: String,
    post: String,
    text: String,
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comment:[{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);