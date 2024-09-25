const express = require('express');
const router = express.Router();
const Story = require('../model/story');  // Correct import of Story model
const signin = require('../middleware/signin');

// Create a new post (story)
router.post('/story', signin, async (req, res) => {
  try {
    const { description, image } = req.body;
    console.log(description, image);
    
    // Validation: Check if description is provided
    if (!description) {
      return res.status(400).json({ error: 'Please add all the fields' });
    }

    const user = req.user; // The user should be available via the signin middleware
    
    // Create a new story instance
    const story = new Story({
      storyDescription: description,
      imageUrl: image,
      user_id: user._id,  // Associating story with the user
    });

    // Save the story to the database
    await story.save();
    res.status(201).json({ story, message: "Story created successfully" });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});
// Get all stories
router.get('/getPosts', signin, async (req, res) => {
    try {
      const stories = await Story.find()
        .sort({ createdAt: -1 })  // Sort by newest first
        .populate("user_id", "_id username");  // Populate user information (id and username)
      
      res.status(200).json(stories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  