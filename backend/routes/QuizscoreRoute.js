import express from "express";
import { submitQuizScore } from "../controllers/QuizscoreController.js";

const router = express.Router();

router.post("/submit", submitQuizScore);

export default router;