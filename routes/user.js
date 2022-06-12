const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');
const authCtrl = require('../controllers/auth');
const password = require('../middleware/password');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/* AUTH */
router.post('/signup', password, multer, authCtrl.signup);
router.post('/login', authCtrl.login);
router.get('/logout', authCtrl.logout);

/* USER */
router.delete('/:id', auth, userCtrl.deleteUser);
router.put('/:id', auth, multer, userCtrl.modifyUser);

module.exports = router;
