const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');
const authCtrl = require('../controllers/auth');
const password = require('../middleware/password');
const multer = require('../middleware/multer-config');

/* AUTH */
router.post('/signup', password, multer, authCtrl.signup);
router.post('/login', authCtrl.login);
// router.get('/logout', authCtrl.logout);

/* USER */
router.get('/', userCtrl.getAllUsers);
router.get('/:id', userCtrl.getOneUser);
router.put('/', auth, userCtrl.modifyUser);
router.delete('/', auth, userCtrl.deleteUser);

module.exports = router;
