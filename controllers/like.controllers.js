const User = require("../models/user");
const Post = require("../models/post");

const likePost = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (post) {
            post.likes.push(userId);
            const updatedPost = await post.save();

            console.log("post", post);
            return res.status(200).json({
                success: true,
                post: updatedPost,
            });
        }
        return res.status(401).json({
            success: false,
            message: "Post not Found!",
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Can't Like the Post!",
            errorMessage: error.message,
        });
    }
};

const removeLike = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (post) {
            post.likes.splice(post.likes.indexOf(userId), 1);
            const updatePost = await post.save();
            return res.status(200).json({
                success: true,
                post: updatePost,
            });
        }

        return res.status(401).json({
            success: false,
            message: "Post not Found!",
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Can't Like the Post!",
            errorMessage: error.message,
        });
    }
};

module.exports = { likePost, removeLike };