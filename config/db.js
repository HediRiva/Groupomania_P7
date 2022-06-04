const mongoose = require('mongoose');
require('dotenv').config;

mongoose
  .connect(process.env.MongoDB_USER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Failed to connect to MongoDB', error));
