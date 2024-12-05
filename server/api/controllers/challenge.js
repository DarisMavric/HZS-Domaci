import mongoose from "mongoose"
import { Challenge, Question, Quiz } from "../models/quizModel.js";


export const createChallenge = async (req, res) => {
    console.log(req.body);
    try {
      const { challengerId, category } = req.body;
  
      const randomQuiz = await Quiz.aggregate([
        { $match: { category: category } }, 
        { $sample: { size: 1 } }, 
        { $project: { _id: 1 } }, 
      ]);
  
      if (randomQuiz.length === 0) {
        return res.status(404).json({ message: 'No quizzes found in this category' });
      }
  
      const quizId = randomQuiz[0]._id;
  
      const challenge = await Challenge.create({
        challengerId,
        quizId,
      });
  
      if (challenge) {
        res.status(200).json({ challengeId: challenge._id });  // Return { challengeId }
      } else {
        res.status(400).json({ message: 'Error creating challenge' });
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      res.status(500).json({ message: 'Error creating challenge', error: error.message });
    }
};


export const updateChallenge = async (req, res) => {
    const { challengeId, userId } = req.body;
  
    try {
      const challenge = await Challenge.findById(challengeId);
  
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }
      if (challenge.challengerId.toString() !== userId) {

        challenge.opponentId = userId;
        await challenge.save();
  
        console.log('Challenge updated:', challenge);
        return res.status(200).json({ message: 'Challenge updated', challenge });
      } else {
        return res.status(400).json({ message: 'User cannot be their own opponent' });
      }
    } catch (error) {
      console.error('Error updating challenge:', error);
      res.status(500).json({ message: 'Error updating challenge', error: error.message });
    }
  };

  export const getChallenge = async (req, res) => {
    const { id } = req.params;
  
    try {
      const challenge = await Challenge.findById(id);
  
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }
      const questions = await Question.find({ quizId: challenge.quizId});
      if(questions){
        res.status(200).json(questions);
      }
    } catch (error) {
      console.error('Error updating challenge:', error);
      res.status(500).json({ message: 'Error updating challenge', error: error.message });
    }
  };
  

