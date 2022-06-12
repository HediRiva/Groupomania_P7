const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    message: { type: String, maxlength: 400 },
    picture: { type: String },
    likers: { type: [String], required: true },
    dislikers: { type: [String], required: true },
    comments: {
      type: [
        {
          commentPublisherId: String,
          commentPublisherPseudo: String,
          text: String,
          timestamp: Number,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
