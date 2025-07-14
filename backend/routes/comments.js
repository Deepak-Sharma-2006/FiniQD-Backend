// routes/comments.js
import express from "express";
import {
    createComment,
    getCommentsByTopic,
    voteComment
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", createComment);
router.get("/:topicId", getCommentsByTopic);
router.post("/vote/:commentId", voteComment);

export default router;