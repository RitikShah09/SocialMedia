const express = require("express");
const router = express.Router();
const User = require('../Models/User');
const passport = require('passport');
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helpers");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dveet6tvu",
  api_key: "465274611695447",
  api_secret: "3GoDxiVARr2VgYBR3Zhjp96p5ug",
});
router.post("/register", async (req, res) => {
  const { email, password, name, username } = req.body;

  const user = await User.findOne({ email: email })
    .populate("savedPost")
    .populate("posts");
  if (user) {
    return res
      .status(403)
      .json({ error: "A user with this email already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUserData = {
    email,
    password: hashedPassword,
    name,
    username,
  };
  const newUser = await User.create(newUserData);
  console.log(newUserData);

  const token = await getToken(email, newUser);

  // Step 5: Return the result to the user
  const userToReturn = { ...newUser.toJSON(), token };
  console.log(userToReturn);
  delete userToReturn.password;
  return res.status(200).json(userToReturn);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email })
    .populate({
      path: "savedPost",
      populate:"comment"
    })
    .populate({
      path: "posts",
      populate: {
        path: "comment",
        populate: {
          path: "reply",
          populate: {
            path: "replyReplyId",
          },
        },
      },
    });
  if (!user) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  const token = await getToken(user.email, user);
  const userToReturn = { ...user.toJSON(), token };
  delete userToReturn.password;
  return res.status(200).json(userToReturn);
});

router.get(
  "/loggedinuser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
   const user = await User.findById(req.user._id);
   const posts = user.posts;
    const followers = user.follower;
   const following = user.following;
   const userId = user._id;

   // Removing Avatar from cloudinary
   await cloudinary.v2.uploader.destroy(user.avatar.public_id);

   await user.remove();

   // Logout user after deleting profile

   res.cookie("token", null, {
     expires: new Date(Date.now()),
     httpOnly: true,
   });

   // Delete all posts of the user
   for (let i = 0; i < posts.length; i++) {
     const post = await Post.findById(posts[i]);
     await cloudinary.v2.uploader.destroy(post.image.public_id);
     await post.remove();
   }

   // Removing User from Followers Following
   for (let i = 0; i < followers.length; i++) {
     const follower = await User.findById(followers[i]);

     const index = follower.following.indexOf(userId);
     follower.following.splice(index, 1);
     await follower.save();
   }

   // Removing User from Following's Followers
   for (let i = 0; i < following.length; i++) {
     const follows = await User.findById(following[i]);

     const index = follows.followers.indexOf(userId);
     follows.followers.splice(index, 1);
     await follows.save();
   }

   // removing all comments of the user from all posts
   const allPosts = await Post.find();

   for (let i = 0; i < allPosts.length; i++) {
     const post = await Post.findById(allPosts[i]._id);

     for (let j = 0; j < post.comments.length; j++) {
       if (post.comments[j].user === userId) {
         post.comments.splice(j, 1);
       }
     }
     await post.save();
   }
   // removing all likes of the user from all posts

   for (let i = 0; i < allPosts.length; i++) {
     const post = await Post.findById(allPosts[i]._id);

     for (let j = 0; j < post.likes.length; j++) {
       if (post.likes[j] === userId) {
         post.likes.splice(j, 1);
       }
     }
     await post.save();
   }

   res.status(200).json({
     success: true,
     message: "Profile Deleted",
   });
  }
);


 

router.post(
  "/reset/password",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { password, newPassword } = req.body;
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId })
      .populate("savedPost")
      .populate({
        path: "posts",
        populate: {
          path: "comment",
          populate: {
            path: "reply",
            populate: {
              path: "replyReplyId",
            },
          },
        },
      });
    if (!user) {
      return res.status(403).json({ err: "User Not Found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ err: "Invalid Password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.save();
    return res.status(200).json(user);
  }
);

router.get("/loggedinuser", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const userId = req.user._id;
   const userDetails = await User.findOne({_id: userId });
   return res.status(200).json({ data: userDetails });
  
})

router.post(
  "/update/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        bio: req.body.bio,
      }
    ).populate("savedPost");
    return res.status(200).json( updatedUser );
  }
);

router.post(
  "/update/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        Image: req.body.Image,
        public_id: req.body.public_id,
      }
    ).populate("savedPost");
    return res.status(200).json({ data: updatedUser });
  }
);

router.post(
  "/search",
  async (req, res) => {
    search = req.body.search;
    var data = await User.find({
      username: { $regex: ".*" + search + ".*", $options: "i" },
    });
    return res.status(200).json(data);
  }
);


router.post(
  "/follow",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const followedUser = await User.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { follower: req.user._id },
      },
      {
        new: true,
      })
      ;
       const currentUser = await User.findByIdAndUpdate(
         req.user._id,
         {
           $push: { following: req.body.followId },
         },
         { new: true }
       ).populate("savedPost");
     return res.status(200).json({ currentUser: currentUser, followedUser: followedUser });
  }
);

router.post(
  "/unfollow",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const followedUser = await User.findByIdAndUpdate(
      req.body.followId,
      {
        $pull: { follower: req.user._id },
      },
      {
        new: true,
      }
    );
    const currentUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.followId },
      },
      { new: true }
    ).populate("savedPost");
    return res
      .status(200)
      .json({ currentUser: currentUser, followedUser: followedUser });
  }
);

module.exports = router;
