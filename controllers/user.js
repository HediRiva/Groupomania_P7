const fs = require('fs');

const User = require('../models/User');

exports.modifyUser = (req, res, next) => {
  User.updateOne(
    { _id: req.params.id },
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      picture: req.body.picture,
      bio: req.body.bio,
      _id: req.params.id,
    }
  )
    .then(() => res.status(200).json({ message: 'User modified !' }))
    .catch((error) => res.status(400).json({ message: 'Invalid request !' }));
};

exports.deleteUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((User) => {
      const filename = User.picture.split('/images/')[1];
      fs.unlink(`images/profile/${filename}`, () => {
        User.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'User deleted !' }))
          .catch(() => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error: 'Invalid request !' }));
};
