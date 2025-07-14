import Comment from "../models/Comment.js";

export const createComment = async (req, res) => {
    try {
        const { topicId, userEmail, text, parentId = null } = req.body;
        const comment = new Comment({ topicId, userEmail, text, parentId });
        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: "Error creating comment", error: err });
    }
};

export const getCommentsByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const comments = await Comment.find({ topicId }).sort({ createdAt: 1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching comments", error: err });
    }
};

export const voteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { type, userEmail } = req.body;
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (!comment.votedBy) comment.votedBy = [];

        // Fix: Use template literals for upKey and downKey
        const upKey = `${userEmail}-up`;
        const downKey = `${userEmail}-down`;

        const hasUpvoted = comment.votedBy.includes(upKey);
        const hasDownvoted = comment.votedBy.includes(downKey);

        if (type === "upvote") {
            if (hasUpvoted) {
                comment.upvotes--;
                comment.votedBy = comment.votedBy.filter(v => v !== upKey);
            } else {
                if (hasDownvoted) {
                    comment.downvotes--;
                    comment.votedBy = comment.votedBy.filter(v => v !== downKey);
                }
                comment.upvotes++;
                comment.votedBy.push(upKey);
            }
        } else if (type === "downvote") {
            if (hasDownvoted) {
                comment.downvotes--;
                comment.votedBy = comment.votedBy.filter(v => v !== downKey);
            } else {
                if (hasUpvoted) {
                    comment.upvotes--;
                    comment.votedBy = comment.votedBy.filter(v => v !== upKey);
                }
                comment.downvotes++;
                comment.votedBy.push(downKey);
            }
        }

        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ message: "Error voting comment", error: err });
    }
};