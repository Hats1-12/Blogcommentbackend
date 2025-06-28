import Comment from '../model/comment.model.js';

// ---- MAIN COMMENT FUNCTIONS ----

// POST a new comment for a blog
export const addComment = async (req, res) => {
  try {
    const newComment = new Comment({
      blogId: req.params.blogId, // Get blogId from the URL parameter
      comment: req.body.comment,
      userId: req.user.id, // Comes from verifyToken middleware
    });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

// GET all comments for a blog
export const getCommentsByBlogId = async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId })
      .populate('userId', 'username') // Get main comment user's info
      .populate('replies.userId', 'username'); // Get user info for each reply
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
};

// PUT (edit) a comment
export const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });
    if (comment.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized.' });
    
    comment.comment = req.body.comment || comment.comment;
    await comment.save();
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error updating comment', error: err.message });
  }
};

// DELETE a comment
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found.' });
        if (comment.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized.' });
        
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting comment', error: err.message });
    }
}

// ---- REPLY FUNCTIONS ----

// POST a new reply to a comment
export const addReply = async (req, res) => {
  try {
    const parentComment = await Comment.findById(req.params.commentId);
    if (!parentComment) return res.status(404).json({ message: 'Comment not found.' });
    
    const reply = { text: req.body.text, userId: req.user.id };
    parentComment.replies.push(reply);
    await parentComment.save();
    res.status(201).json(parentComment);
  } catch (err) {
    res.status(500).json({ message: 'Error adding reply', error: err.message });
  }
};

// PUT (edit) a reply
export const editReply = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    const reply = comment.replies.id(req.params.replyId); // Special Mongoose .id() function
    if (!reply) return res.status(404).json({ message: 'Reply not found.' });
    if (reply.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized.' });
    
    reply.text = req.body.text || reply.text;
    await comment.save();
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error updating reply', error: err.message });
  }
};

// DELETE a reply
export const deleteReply = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    const reply = comment.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found.' });
    if (reply.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized.' });

    reply.remove(); // Special Mongoose .remove() function for subdocuments
    await comment.save();
    res.status(200).json({ message: 'Reply deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting reply', error: err.message });
  }
};