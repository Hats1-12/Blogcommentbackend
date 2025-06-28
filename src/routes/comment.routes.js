import express from 'express';
import {
  addComment, getCommentsByBlogId, editComment, deleteComment,
  addReply, editReply, deleteReply
} from '../controller/comment.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET all comments for a blog (public)
router.get('/blogs/:blogId/comments', getCommentsByBlogId);

// POST a new comment to a blog (protected)
router.post('/blogs/:blogId/comments', verifyToken, addComment);

// PUT (edit) a specific comment (protected)
router.put('/comments/:commentId', verifyToken, editComment);

// DELETE a specific comment (protected)
router.delete('/comments/:commentId', verifyToken, deleteComment);

// --- Reply Routes ---
// POST a new reply to a comment (protected)
router.post('/comments/:commentId/replies', verifyToken, addReply);

// PUT (edit) a specific reply (protected)
router.put('/comments/:commentId/replies/:replyId', verifyToken, editReply);

// DELETE a specific reply (protected)
router.delete('/comments/:commentId/replies/:replyId', verifyToken, deleteReply);

export default router;