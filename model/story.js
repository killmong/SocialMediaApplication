const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
  
const storySchema = new Schema({
  user_id: {
    type: Types.ObjectId,
    ref : 'User'
  },
  storyDescription: {
    type: String,
  },
  imageUrl:{
    type: String,
    
  }
  },
  { timestamps: true }); 
module.exports = mongoose.model("Story", storySchema);
