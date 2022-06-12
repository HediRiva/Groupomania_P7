const jwt = require('jsonwebtoken');
require('dotenv').config;

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, process.env.MY_TOKEN);
    const userId = decodedToken.userId;
    console.log(userId);
    if (req.body.userId && req.body.userId !== userId) {
      res.status(401).json({
        message: 'Invalid userID !',
      });
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      message: 'Invalid request !',
    });
  }
};
