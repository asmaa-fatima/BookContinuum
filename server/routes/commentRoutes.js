const { Router } = require('express');
const { createComment, getCommentsByPost, getComment, editComment, deleteComment, likeComment, getCommentsByUser } = require('../controllers/commentControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.post('/post/:postId', authMiddleware, createComment);
router.get('/post/:postId', getCommentsByPost);
router.get('/:id', getComment);
router.patch('/:id', authMiddleware, editComment);
router.delete('/:id', authMiddleware, deleteComment);
router.patch('/:id/like', authMiddleware, likeComment);
router.get('/user/:userId', getCommentsByUser);

module.exports = router;