import express from "express";
import { acceptRequest, addFriend, declineRequest, getFriends } from "../controllers/friends.js";

const router = express.Router();


router.post('/addFriend',addFriend);
router.post('/getFriends',getFriends);
router.post('/acceptRequest',acceptRequest);
router.delete('/declineRequest',declineRequest);

export default router;