const Post = require('../models/Post');
const User = require('../models/User');

const fs = require('fs');

exports.createPost = (req, res, next) => {
  const post = new Post({
    userId: req.body.userId,
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
    {
      ...req.body,
      _id: req.params.id,
    }
  )
    .then(() => res.status(200).json({ message: 'Modified post !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((Post) => {
      const filename = Post.picture.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Post.deleteOne({ _id: req.params.id });
        User.updateOne(
          { _id: req.body.id },
          { $pull: { likes: req.body.id }, $inc: { likers: -1 } }
        )
          .then((post) => res.status(200).json({ message: 'Post deleted !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch(() => res.status(500).json({ message: 'Invalid request !' }));
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
//       { $push: { likers: req.body.id }, $inc: { likes: +1 } }
//     );
//     User.updateOne(
//       { _id: req.body.id },
//       { $push: { likes: req.params.id }, $inc: { likers: +1 } }
//     )
//       .then(() => res.status(200).json({ message: 'Post liked !' }))
//       .catch((error) => res.status(400).json({ error }));
//   }

//   if (req.body.like == 0) {
//     Post.findOne({ _id: req.params.id })
//       .then((Post) => {
//         if (Post.likers.includes(req.body.id)) {
//           Post.updateOne(
//             { _id: req.params.id },
//             { $pull: { likers: req.body.id }, $inc: { likes: -1 } }
//           );
//           User.updateOne(
//             { _id: req.body.id },
//             { $pull: { likes: req.body.id }, $inc: { likers: -1 } }
//           )
//             .then(() => res.status(200).json({ message: 'Like removed !' }))
//             .catch((error) => res.status(400).json({ error }));
//         }
//         if (Post.dislikers.includes(req.body.id)) {
//           Post.updateOne(
//             { _id: req.params.id },
//             {
//               $pull: { dislikers: req.body.id },
//               $inc: { dislikes: -1 },
//             }
//           );
//           User.updateOne(
//             { _id: req.body.id },
//             {
//               $pull: { dislikes: req.body.id },
//               $inc: { dislikers: -1 },
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
//       { $push: { dislikers: req.body.id }, $inc: { dislikes: +1 } }
//     );
//     User.updateOne(
//       { _id: req.body.id },
//       { $push: { dislikes: req.body.id }, $inc: { dislikers: +1 } }
//     )
//       .then(() => res.status(200).json({ message: 'Post disliked !' }))
//       .catch((error) => res.status(400).json({ error }));
//   }
// };
