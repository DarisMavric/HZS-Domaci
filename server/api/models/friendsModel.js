import mongoose from "mongoose"

const FriendsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  username: {
    type: String,
    ref: "users",
    required: true
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  friendName: {
    type: String,
    ref: "users",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Friends = mongoose.model("Friends", FriendsSchema);