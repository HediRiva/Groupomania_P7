const express = require('express');

const router = express.Router();

const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Posts
router.get('/', postCtrl.readPost);
router.post('/', auth, multer, postCtrl.createPost);
router.put('/', auth, multer, postCtrl.modifyPost);
router.delete('/', auth, postCtrl.deletePost);
router.patch('/like/:id', postCtrl.likePost);
router.patch('/unlike/:id', postCtrl.unlikePost);

//Comments
router.patch('/comment-post/:id', postCtrl.commentPost);
router.patch('/edit-comment-post/:id', postCtrl.editCommentPost);
router.patch('/delete-comment-post/:id', auth, postCtrl.deleteCommentPost);

module.exports = router;
