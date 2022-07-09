const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cryptoJs = require('crypto-js');
const User = require('../models/User');
require('dotenv').config();

exports.signup = (req, res, next) => {
  const cryptedEmail = cryptoJs
    .HmacSHA256(req.body.email, process.env.SECRET_EMAIL_KEY)
    .toString();
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        pseudo: req.body.pseudo,
        email: cryptedEmail,
        password: hash,
      });
      console.log(user);
      user
        .save()
        .then(() => res.status(201).json({ message: 'User created !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  const cryptedEmail = cryptoJs
    .HmacSHA256(req.body.email, process.env.SECRET_EMAIL_KEY)
    .toString();
  User.findOne({ email: cryptedEmail })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'User not found !' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Wrong password !' });
          }

          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json(error));
};

// exports.logout = (req, res, next) => {
//   res.headers.authorization('');
//   res.status(200).json({ message: 'Logged out user !' });
// };
