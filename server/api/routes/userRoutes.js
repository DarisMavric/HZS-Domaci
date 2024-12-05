import express from 'express'
import { regUser,logUser, getUsers, getUser } from '../controllers/user.js';

const router = express.Router();

router.post('/login',logUser);
router.post('/register',regUser);
router.get('/getUsers',getUsers);
router.post('/getUser',getUser);


export default router;