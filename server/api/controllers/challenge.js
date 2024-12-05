import mongoose from "mongoose"
import { Challenge } from "../models/quizModel.js";


export const createChallenge = async(req,res) => {
    console.log(req.body);
    try {
        const { challengerId, quizId, status } = req.body;
    
        const challenge = await Challenge.create({
          challengerId,
          quizId,
        });
    
        if(challenge){
            res.status(200).json(challenge._id);
        } else {
            res.status(400).json('Error');
        }
      } catch (error) {
        res.status(500).json('Error creating challenge');
      }
}

export const updateChallenge = async (req, res) => {
    const { challengeId, userId } = req.body;
  
    try {
      // Fetch the challenge by ID
      const challenge = await Challenge.findById(challengeId);
  
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }
  
      // Check if the challengerId is not the same as userId
      if (challenge.challengerId.toString() !== userId) {
        // Update the opponentId
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
  

