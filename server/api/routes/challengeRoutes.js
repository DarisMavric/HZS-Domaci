import express from "express";
import { createChallenge,updateChallenge } from "../controllers/challenge.js";

const router = express.Router();


router.post('/createChallenge',createChallenge);
router.post('/updateChallenge',updateChallenge);


export default router;