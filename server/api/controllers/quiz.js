import mongoose from "mongoose"
import { Quiz,Question,userAnswer } from "../models/quizModel.js";
import { User } from "../models/userModel.js";


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

export const getQuizQuestions = async(req,res) => {
    const {id} = req.params;
    const quizes = await Question.find({quizId: id});
    if(quizes){
        return res.status(200).json(quizes);
    } else {
        return res.status(400).json('Error');
    }
}

export const quizReward = async (req, res) => {
    const { userId, quizId } = req.body;

    console.log('Request received with userId:', userId, 'quizId:', quizId);
  
    try {
      const quiz = await Quiz.findOne({ _id: quizId });
  
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { points: quiz.points } },
        { new: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({ message: "Points updated successfully", updatedUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error", error });
    }
  };

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
