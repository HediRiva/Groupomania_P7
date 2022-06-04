const { isValidObjectId } = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = (req, res, next) => {
  const post = new Post({
    publisherId: req.body.publisherId,
    message: req.body.message,
    picture: req.body.picture,
    likers: [''],
    comments: [{}],
  });
  post
    .save()
    .then(() => res.status(201).json({ message: 'Post created !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyPost = (req, res, next) => {
  Post.updateOne(
    { _id: req.params.id },
    { message: req.body.message, picture: req.body.picture, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Modified post !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((Post) => {
      Post.deleteOne({ _id: req.params.id })
        .then((post) => res.status(200).json({ message: 'Post deleted !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ message: 'Invalid request !' }));
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllPosts = (req, res, next) => {
  Post.find()
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json({ error }));
};

// exports.likePost = (req, res, next) => {
//   if (req.body.like == 1) {
//     Post.updateOne(
//       { _id: req.params.id },
//       { $push: { usersLiked: req.body.publisherId }, $inc: { likes: +1 } }
//     )
//       .then(() => res.status(200).json({ message: 'Post liked !' }))
//       .catch((error) => res.status(400).json({ error }));
//   }

//   if (req.body.like == 0) {
//     Post.findOne({ _id: req.params.id })
//       .then((Post) => {
//         if (Post.usersLiked.includes(req.body.publisherId)) {
//           Post.updateOne(
//             { _id: req.params.id },
//             { $pull: { usersLiked: req.body.publisherId }, $inc: { likes: -1 } }
//           )
//             .then(() => res.status(200).json({ message: 'Like removed !' }))
//             .catch((error) => res.status(400).json({ error }));
//         }
//         if (Post.usersDisliked.includes(req.body.publisherId)) {
//           Post.updateOne(
//             { _id: req.params.id },
//             {
//               $pull: { usersDisliked: req.body.publisherId },
//               $inc: { dislikes: -1 },
//             }
//           )
//             .then(() => res.status(200).json({ message: 'Like removed !' }))
//             .catch((error) => res.status(404).json({ error }));
//         }
//       })
//       .catch((error) => res.status(400).json({ error }));
//   }

//   if (req.body.like == -1) {
//     Post.updateOne(
//       { _id: req.params.id },
//       { $push: { usersDisliked: req.body.publisherId }, $inc: { dislikes: +1 } }
//     )
//       .then(() => res.status(200).json({ message: 'Post disliked !' }))
//       .catch((error) => res.status(400).json({ error }));
//   }
// };

exports.likePost = async (req, res) => {
  if (!isValidObjectId(req.params.id))
    return res.status(400).send('Unknown Id : ' + req.params.id);

  try {
    await Post.findOneByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true },
      (error, docs) => {
        if (error) return res.status(400).send(error);
      }
    );
    await User.findOneByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true },
      (error, docs) => {
        if (!error) res.send(docs);
        else return res.status(400).send(error);
      }
    );
  } catch (error) {
    return res.status(400).send(error);
  }
};
