const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    publisherId: { type: String, required: true },
    message: { type: String, maxlength: 400 },
    picture: { type: String },
    likers: { type: [String], required: true },
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
