const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {
    pseudo: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    picture: {
      type: String,
      default: 'desktop/uploadP7/profil/random-user.jpeg',
    },
    bio: { type: String, max: 1024 },
    followers: { type: [String] },
    following: { type: [String] },
    likes: { type: [String] },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
