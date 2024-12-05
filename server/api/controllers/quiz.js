import mongoose from "mongoose"
import { Quiz,Question,userAnswer } from "../models/quizModel.js";


export const addQuiz = async(req,res) => {
    const {title,category,difficulty,points} = req.body;
    if(title && category && difficulty && points){
        const newQuiz = await Quiz.create({
            title,
            category,
            difficulty,
            points
        });
        if(newQuiz){
            res.status(200).json(newQuiz);
        } else {
            res.status(400).json('Error');
        }
    
    }else {
        res.status(400).json('All fields are mandatory!');
    }
}

export const addQuizQuestion = async(req,res) => {
    const {
        quizId,
        questionText,
        options: {A,B,C,D},
        correctAnswer,
        explanation
    } = req.body;
    if(quizId && questionText && A && B && C && D && correctAnswer && explanation){
        const newQuestion = await Question.create({
            quizId,
            questionText,
            correctAnswer,
            explanation,
            options: { A, B, C, D },
        });
        if(newQuestion){
            res.status(200).json(newQuestion);
        } else {
            res.status(400).json('Error');
        }
    
    }else {
        res.status(400).json('All fields are mandatory!');
    }
}

export const getQuizzes = async(req,res) => {
    const quizes = await Quiz.find();
    if(quizes){
        return res.status(200).json(quizes);
    } else {
        return res.status(400).json('Error');
    }
}

export const deleteQuiz = async(req,res) => {
    const {quizId} = req.body;
    const quiz = await Quiz.findByIdAndDelete(quizId);
    const questions = await Question.deleteMany({quizId: quizId})
    if(quiz && questions){
        return res.status(200).json('Quiz and questions deleted!');
    }else {
        return res.status(400).json("Error");
    }
}
