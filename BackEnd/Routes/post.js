const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../Models/User");
const Post = require("../Models/Post");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dveet6tvu",
  api_key: "465274611695447",
  api_secret: "3GoDxiVARr2VgYBR3Zhjp96p5ug",
});
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user._id;
    const userDetails = await User.findOne({ _id: userId }).populate("posts");
    const { text, post, Ext, public_id } = req.body;
    if (!post) {
      return res
        .status(301)
        .json({ err: "Insufficient details to create post." });
    }
    const postDetails = { text, post, Ext, public_id, userid: req.user._id };
    const createdPost = await Post.create(postDetails);
    userDetails.posts.push(createdPost._id);
    userDetails.save();
    return res
      .status(200)
      .json({ createdPost: createdPost, user: userDetails });
  }
);

// { userid: { $in: req.user.following } }
router.get(
  "/allpost",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find({
      userid: { $in: [req.user.following, req.user._id] },
    })
      .populate("userid")
      .populate({
        path: "comment",
        populate: {
          path: "userid",
        },
      })
      .sort("-createdAt")
      .then((posts) => {
        res.json({ posts });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

router.get(
  "/mypost",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find({ userid: req.user._id })
      .populate("userid")
      .populate({
        path: "comment",
        populate: {
          path: "userid",
        },
      })
      .sort("-createdAt")
      .then((posts) => {
        res.json({ posts });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
router.get(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const posts = await Post.find({ userid: req.params.id })
      .populate("userid")
      .populate("comment")
      .sort("-createdAt");
    const user = await User.findById(req.params.id);
    res.json({ post: posts, user: user });
  }
);

router.get(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      if (post.userid.toString() !== req.user._id.toString()) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      await cloudinary.uploader.destroy(post.public_id);
      await Post.findByIdAndDelete(req.params.id);
      const user = await User.findById(req.user._id);

      const index = user.posts.indexOf(req.params.id);
      user.posts.splice(index, 1);
      await user.save();

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

router.post(
  "/like",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { like: req.user._id },
      },
      {
        new: true,
      }
    )
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
    return res.status(200).json(updatedPost);
  }
);

router.post(
  "/unlike",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { like: req.user._id },
      },
      {
        new: true,
      }
    )
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
    return res.status(200).json(updatedPost);
  }
);

router.post(
  "/savepost",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user._id;
    const postId = req.body.postId;
    const post = await Post.findById(postId);
    const user = await User.findById(userId).populate('savedPost');
    if (user.savedPost.includes(postId)) {
      const index = user.savedPost.indexOf(postId);
      user.savedPost.splice(index, 1);
      await user.save();
      return res.status(200).json(user);
    } else {
      user.savedPost.push(postId);
      await user.save();
      return res.status(200).json(user);
    }
  }
);

module.exports = router;
