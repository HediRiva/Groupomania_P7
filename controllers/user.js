const fs = require('fs');

const User = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

exports.getOneUser = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).json('Unknown ID : ' + req.params.id);
  User.findById(req.params.id, (err, data) => {
    if (!err) res.json(data);
    else console.log('Unknown ID : ' + err);
  }).select('-password');
};

exports.modifyUser = async (req, res) => {
  if (!ObjectId.isValid(req.body.id))
    return res.status(400).json('Unknown ID : ' + req.body.id);
  try {
    const user = await User.findById(req.body.userId);
    user.bio = req.body.bio;
    await user.save();
    res.status(200).json({ message: 'Bio updated' });
  } catch (error) {
    res.status(500).json({ error: 'Invalid request !' });
  }
};

exports.deleteUser = async (req, res) => {
  if (!ObjectId.isValid(req.body.userId))
    return res.status(400).json('Unknown ID : ' + req.body.userId);
  try {
    const user = await User.findById(req.body.userId);
    await user.remove();
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Invalid request !' });
  }
};
