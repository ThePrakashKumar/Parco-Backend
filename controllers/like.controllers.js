const Post = require("../models/post");
const Notification = require("../models/notification");

const createLikeNotification = async (post, source) => {
    if (post.user._id.toString() !== source) {
        try {
            const newNotification = new Notification({
                notificationType: "LIKE",
                post: post._id,
                sourceUser: source,
                targetUser: post.user,
            });
            await newNotification.save();
        } catch (error) {
            console.log(error);
        }
    }
};

const likePost = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (post) {
            post.likes.push(userId);
            const updatedPost = await post.save();
            createLikeNotification(updatedPost, userId);
            return res.status(200).json({
                success: true,
                postId: updatedPost._id,
                likes: updatedPost.likes,
            });
        }
        return res.status(401).json({
            success: false,
            message: "Post not Found!",
        });
    } catch (error) {
        console.log(error);
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
            const updatedPost = await post.save();
            return res.status(200).json({
                success: true,
                postId: updatedPost._id,
                likes: updatedPost.likes,
            });
        }

        return res.status(401).json({
            success: false,
            message: "Post not Found!",
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            message: "Can't Like the Post!",
            errorMessage: error.message,
        });
    }
};

module.exports = { likePost, removeLike };
