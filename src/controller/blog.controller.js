import Blog from '../model/blog.model.js';
import User from '../model/user.model.js'; // Needed for role check

// --- Create a new blog post ---
export const createBlog = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Your professional role-based security check
        if (user.role !== 'consultant') {
            return res.status(403).json({ message: 'Only consultants can post blogs' });
        }

        // Get all required fields from the request body
        const { title, description, content, image } = req.body;
        if (!title || !description || !content || !image) {
            return res.status(400).json({ message: 'Title, description, content, and image are all required' });
        }

        const blog = new Blog({ 
            title, description, content, image, 
            author: req.user.id 
        });
        await blog.save();

        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create blog', error: error.message });
    }
};

// --- Get all blogs ---
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
    }
};

// --- Get a single blog by its ID (for the Read More page) ---
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'username');
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blog', error: err.message });
    }
}

// --- Update a blog by ID ---
export const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        // Your excellent ownership-based security check
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this blog' });
        }
        
        // Update any fields that were provided in the request
        const { title, description, content, image } = req.body;
        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.content = content || blog.content;
        blog.image = image || blog.image;

        await blog.save();
        res.status(200).json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update blog', error: error.message });
    }
};

// --- Delete a blog by ID ---
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this blog' });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete blog', error: error.message });
    }
};