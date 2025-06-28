import express from 'express';
import { 
    createBlog, 
    getAllBlogs,
    getBlogById,
    updateBlog, 
    deleteBlog 
} from '../controller/blog.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// --- Public Routes ---
// Anyone can view all blogs or a single blog
// Maps to: GET /api/blogs
router.get('/blogs', getAllBlogs);
// Maps to: GET /api/blogs/:id
router.get('/blogs/:id', getBlogById);

// --- Protected Routes (require a valid token and proper permissions) ---
// Maps to: POST /api/blogs
router.post('/blogs', verifyToken, createBlog);

// Maps to: PUT /api/blogs/:id
router.put('/blogs/:id', verifyToken, updateBlog);

// Maps to: DELETE /api/blogs/:id
router.delete('/blogs/:id', verifyToken, deleteBlog);

export default router;