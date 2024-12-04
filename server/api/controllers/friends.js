import mongoose from "mongoose"
import { Friends } from "../models/friendsModel.js";
import { User } from "../models/userModel.js";

export const addFriend = async(req,res) => {
    const {userId,friendName} = req.body;
    const friend = await User.findOne({username: friendName});
    const alreadyFriends = await Friends.findOne({
        $or: [
          { userId: userId, friendId: friend._id },
          { userId: friend._id, friendId: userId },
        ],
    });
    if(!alreadyFriends){
        const friends = await Friends.create({
            userId,
            friendId: friend._id
        })
        if(friends){
            return res.status(200).json(friends);
        }else {
            return res.status(400).json('Error');
        }
    } else {
        return res.status(400).json('Already Friends');
    }
}

export const getFriends = async(req,res) => {
    const {userId} = req.body;
    const friends = await Friends.find(({
        $or: [
          { userId: userId },
          { friendId: userId },
        ],
        $and:
        [{$or: [{status: "accepted"},{status: "pending"}]}]
    }));
    if(friends) {
            return res.status(200).json(friends);
        } else {
            return res.status(200).json('no requests');
    }
}

export const acceptRequest = async(req,res) => {
    const {userId,requestId,} = req.body;
    const friend = await Friends.findOne({
        $or: [
          { userId: userId, friendId: requestId },
          { userId: requestId, friendId: userId },
        ],
        status: "pending",
      });
  
      if (friend) {
        const updatedFriend = await Friends.findByIdAndUpdate(
          friend._id,
          { status: "accepted" },
          { new: true }
        );
  
        if (updatedFriend) {
          return res.status(200).json(updatedFriend);
        } else {
          return res.status(500).json({ message: "Failed to update the friend request." });
        }
    } else {
        return res.status(400).json('No request!');
    }
}

export const declineRequest = async(req,res) => {
    const {userId,requestId} = req.body;
    const friend = await Friends.findOne({
        $or: [
          { userId: userId, friendId: requestId },
          { userId: requestId, friendId: userId },
        ],
        status: "pending",
      });
  
      if (friend) {
        const deleteRequest = await Friends.findByIdAndDelete(
          friend._id,
        );
        if (deleteRequest) {
          return res.status(200).json(updatedFriend);
        } else {
          return res.status(500).json({ message: "Failed to update the friend request." });
        }
    } else {
        return res.status(400).json('No request!');
    }
}