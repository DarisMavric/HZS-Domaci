import express from 'express'
import { regUser,logUser, getUsers } from '../controllers/user.js';

const router = express.Router();

router.post('/login',logUser);
router.post('/register',regUser);
router.get('/getUsers',getUsers);


export default router;