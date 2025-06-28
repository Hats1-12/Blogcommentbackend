import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    // Added for the card view on the main blogs page
    description: { 
        type: String, 
        required: true 
    },
    // The full content for the "Read More" page
    content: { 
        type: String, 
        required: true 
    },
    // The URL for the blog's main image
    image: {
        type: String,
        required: true
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
// Use Mongoose's built-in timestamps for automatic createdAt and updatedAt
}, { timestamps: true });


const Blog = mongoose.model('Blog', BlogSchema);
export default Blog;