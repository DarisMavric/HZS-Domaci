import express from 'express'
import { regUser,logUser } from '../controllers/user.js';

const router = express.Router();

router.post('/login',logUser);
router.post('/register',regUser);


export default router;