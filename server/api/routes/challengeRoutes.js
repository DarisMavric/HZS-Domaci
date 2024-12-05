import express from "express";
import { createChallenge,updateChallenge,getChallenge } from "../controllers/challenge.js";

const router = express.Router();


router.post('/createChallenge',createChallenge);
router.post('/updateChallenge',updateChallenge);
router.get('/getChallenge/:id',getChallenge);


export default router;