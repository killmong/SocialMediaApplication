const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
  
const postSchema = new Schema({
  user_id: {
    type: Types.ObjectId,
    ref : 'User'
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl:{
    type: String,
    
  }
  },
  { timestamps: true }); 
module.exports = mongoose.model("Post", postSchema);
