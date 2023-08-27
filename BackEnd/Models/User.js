const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  public_id: String,
  Image: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
  },
  username: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  following: {
    type: Array,
    default: [],
  },
  follower: {
    type: Array,
    default: [],
  },
  password: {
    type: String,
    required: true,
    private: true,
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  reels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  savedPost: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  token: {
    type: String,
  },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
