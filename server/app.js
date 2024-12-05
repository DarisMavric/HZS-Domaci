import express from "express"
import bodyParser from "body-parser";
import connectDB from "./db.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import cors from 'cors';


import userRoutes from "./api/routes/userRoutes.js"
import friendsRoutes from "./api/routes/friendsRoutes.js"
import quizRoutes from "./api/routes/quizRoutes.js"
import challengeRoutes from "./api/routes/challengeRoutes.js"

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))


app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cookieParser());

const PORT = process.env.PORT;

connectDB();

app.use('/api/user/',userRoutes);
app.use('/api/friends/',friendsRoutes);
app.use('/api/quiz/',quizRoutes);
app.use('/api/challenge/',challengeRoutes);


io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('joinRoom', (roomId, userId) => {
    socket.join(roomId);
    io.to(roomId).emit('playerJoined', userId);
  });

  socket.on('submitAnswer', async (roomId, userId, answer) => {
    // Handle player answer submission and update quiz state
    await require('./controllers/quizController').handleAnswer(socket, roomId, userId, answer);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});




server.listen(PORT,(error) => {
  if(!error)
    console.log("Server is Successfully Running, and App is listening on port "+ PORT)
  else 
      console.log("Error occurred, server can't start", error);
  }
);


