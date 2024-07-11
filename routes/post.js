const express = require('express');
const router = express.Router();
const Post = require('../model/post');
const signin = require('../middleware/signin');

// Create a new post
router.post('/createPost', signin, async (req, res) => {
  try {
    const { description, imageUrl } = req.body;
    if (!description || imageUrl) {
      return res.status(400).json({ error: 'Please add all the fields' });
    }
    const user = req.user;
    const post = new Post({
      description,
      imageUrl,
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

module.exports = router;