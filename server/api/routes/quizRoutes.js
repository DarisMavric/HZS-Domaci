import express from "express";
import { addQuiz, addQuizQuestion, deleteQuiz, getQuizzes } from "../controllers/quiz.js";

const router = express.Router();


router.post('/addQuiz',addQuiz);
router.get('/getQuizzes',getQuizzes);
router.delete('/deleteQuiz',deleteQuiz);
router.post('/addQuizQuestion',addQuizQuestion);

export default router;