// models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    topicId: { type: String, required: true }, // supports custom topic ID
    userEmail: { type: String, required: true },
    text: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    votedBy: [{ type: String }]
}, { timestamps: true }); // adds createdAt and updatedAt

export default mongoose.model("Comment", commentSchema);