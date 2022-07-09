const Post = require('../models/Post');
const User = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

const fs = require('fs');

exports.readPost = (req, res, next) => {
  Post.find((error, data) => {
    if (!error) res.status(200).json(data);
    else res.status(400).json('error to get data : ' + error);
  }).sort({ createdAt: -1 });
};

exports.createPost = async (req, res) => {
  const newPost = new Post({
    userId: req.body.userId,
    message: req.body.message,
    picture: req.body.picture,
    likers: [],
    comments: [],
  });
  try {
    const post = await newPost.save();
    return res.status(201).json({ message: 'Post created !' });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

exports.modifyPost = (req, res, next) => {
  const updatedRecord = {
    message: req.body.message,
  };
  Post.findByIdAndUpdate(
    req.body.id,
    { $set: updatedRecord },
    { new: true },
    (error, data) => {
      if (!error) res.json(data);
      else console.log('Update error : ' + error);
    }
  );
};

exports.deletePost = (req, res, next) => {
  Post.findByIdAndRemove(req.body.id, (error, data) => {
    if (!error) res.json({ message: 'Post deleted' });
    else console.log('Delete error : ' + error);
  });
};

exports.likePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json('Unknown ID : ' + req.params.id);
  try {
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.userId },
      },
      { new: true }
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(500).json({ message: error }));

    await User.findByIdAndUpdate(
      req.body.userId,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true }
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(500).json({ message: error }));
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

exports.unlikePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json('Unknown ID : ' + req.params.id);
  try {
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.userId },
      },
      { new: true }
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(500).json({ message: error }));

    await User.findByIdAndUpdate(
      req.body.userId,
      {
        $pull: { likes: req.params.id },
      },
      { new: true }
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(500).json({ message: error }));
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

exports.commentPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json('Unknown ID : ' + req.params.id);

  try {
    return Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    )
      .then((data) => res.json(data))
      .catch((error) => res.status(400).json({ message: error }));
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

exports.editCommentPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json('Unknown ID : ' + req.params.id);
  try {
    return Post.findById(req.params.id, (error, data) => {
      const commentToEdit = data.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );
      if (!commentToEdit)
        return res.status(404).json('Comment not found : ' + error);
      commentToEdit.text = req.body.text;

      return data.save((error) => {
        if (!error) return res.status(200).json(data);
        return res.status(500).json({ message: error });
      });
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

exports.deleteCommentPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json('Unknown ID : ' + req.params.id);

  try {
    return Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (error, data) => {
        if (!error) res.status(200).json(data);
        else return res.status(400).json({ message: error });
      }
    );
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
