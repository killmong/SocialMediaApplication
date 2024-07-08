const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const postSchema = new Schema({
  userid: {
    type: Types.ObjectId,
    required: true,
  },
  timestamps: true,
});

module.exports = mongoose.model("Post", postSchema);
