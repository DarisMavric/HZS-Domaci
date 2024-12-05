import express from "express";
import { addQuiz, addQuizQuestion, deleteQuiz, getQuizQuestions, getQuizzes, quizReward } from "../controllers/quiz.js";

const router = express.Router();


router.post('/addQuiz',addQuiz);
router.get('/getQuizzes',getQuizzes);
router.get('/getQuizQuestions/:id',getQuizQuestions);
router.delete('/deleteQuiz',deleteQuiz);
router.post('/quizReward',quizReward);
router.post('/addQuizQuestion',addQuizQuestion);

export default router;