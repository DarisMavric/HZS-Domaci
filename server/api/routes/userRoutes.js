import express from 'express'
import { regUser,logUser, getUser } from '../controllers/user.js';

const router = express.Router();

router.post('/login',logUser);
router.post('/register',regUser);
router.get('/getUser',getUser);


export default router;