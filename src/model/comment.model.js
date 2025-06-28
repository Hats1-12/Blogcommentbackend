import mongoose from 'mongoose';

// Defining the schema for a single embedded reply
const ReplySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to the User who made the reply
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt for replies

// Defining the main comment schema
const CommentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  // crucial part: an array of embedded replies
  replies: [ReplySchema]
}, { timestamps: true }); // Automatically adds createdAt/updatedAt for parent comments

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;