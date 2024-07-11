const express = require('express');
const router = express.Router();
const Post = require('../model/post');
const signin = require('../middleware/signin');

// Create a new post
router.post('/createPost', signin, async (req, res) => {
  try {
    const { description, image } = req.body;
    console.log(description,image)
    if (!description ) {
      return res.status(400).json({ error: 'Please add all the fields' });
    }
    const user = req.user;
    const post = new Post({
      description,
      imageUrl :image,
      user_id: user._id,
    });
    post.save().then((result) =>
      res.json({ post: result, message: "Post created successfully" }))
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err.message });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


//get posts 
router.get('/getPosts', signin,async (req, res) => {
  Post.find()
  .sort({ createdAt: -1 }) 
  .populate("user_id","_id username") //to get username populate
   .then(posts=>res.json(posts))
  .catch(err=>console.log(err))

})

module.exports = router;