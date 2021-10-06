const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

const addComment = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.postId;
        const { content } = req.body;
        if (userId && postId) {
            const newComment = new Comment({
                user: userId,
                content,
                post: postId,
            });
            const comment = await newComment.save();
            const post = await Post.findById(postId);
            post.comment.push(comment._id);
            const updatedPost = await post.save();
            return res.status(200).json({
                success: true,
                updatedPost,
            });
        }
        return res.status(401).json({
            success: false,
            message: "You are not Authorize!",
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Can't Create the Comment!",
            errorMessage: error.message,
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.postId;
        const commentId = req.params.commentId;

        const post = await Post.findById(postId);
        const comment = await Comment.findById(commentId);

        if (
            comment.user.toString() === userId ||
            post.user.toString() === userId
        ) {
            const deletedComment = await Comment.findByIdAndDelete(commentId);
            post.comment.splice(post.comment.indexOf(comment), 1);
            const updatedPost = await post.save();
            const populatedPost = await updatedPost.populate("comment");
            return res.status(200).json({
                success: true,
                post: populatedPost,
            });
        }
        return res.status(401).json({
            success: false,
            message: "You are not Authorize!",
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            message: "Can't Create the Comment!",
            errorMessage: error.message,
        });
    }
};

module.exports = { addComment, deleteComment };
