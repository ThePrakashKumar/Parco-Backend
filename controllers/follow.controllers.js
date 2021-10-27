const User = require("../models/user");

const follow = async (req, res) => {
    try {
        const user = req.user;
        const followUserId = req.params.followUserId;
        const followUser = await User.findById(followUserId);

        if (followUser) {
            user.following.push(followUserId);
            followUser.followers.push(user._id);
            const updatedUser = await user.save();
            const updatedFollowUser = await followUser.save();
            const populatedUser = await updatedUser.populate("following");

            return res.status(200).json({
                success: true,
                user: populatedUser,
            });
        }
        return res.status(401).json({
            success: false,
            message: "User not Found!",
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Can't Follow the User!",
            errorMessage: error.message,
        });
    }
};

const unfollow = async (req, res) => {
    try {
        const user = req.user;
        const unFollowUserId = req.params.unFollowUserId;
        const unFollowUser = await User.findById(unFollowUserId);

        if (unFollowUser) {
            user.following.splice(user.following.indexOf(unFollowUserId), 1);
            unFollowUser.followers.splice(
                unFollowUser.followers.indexOf(user._id),
                1
            );
            const updatedUser = await user.save();
            const updatedUnFollowUser = await unFollowUser.save();
            const populatedUser = await updatedUser.populate("following");

            return res.status(200).json({
                success: true,
                user: populatedUser,
            });
        }
        return res.status(401).json({
            success: false,
            message: "User not Found!",
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Can't Unfollow the User!",
            errorMessage: error.message,
        });
    }
};

module.exports = { follow, unfollow };