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

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  }
});

app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE"], credentials: true }));


app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cookieParser());

const PORT = process.env.PORT;

connectDB();

app.use('/api/user/',userRoutes);
app.use('/api/friends/',friendsRoutes);
app.use('/api/quiz/',quizRoutes);
app.use('/api/challenge/',challengeRoutes);


let waitingPlayers = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for 'joinChallenge' event to register the player
  socket.on("joinChallenge", ({ userId, challengeId }) => {
    console.log(`${userId} joined challenge: ${challengeId}`);
    
    // Check if there's already a player waiting for this challenge
    if (waitingPlayers[challengeId] && waitingPlayers[challengeId].length === 1) {
      // Start the challenge if both players are ready
      const opponentSocket = waitingPlayers[challengeId][0];
      io.to(opponentSocket).emit("startChallenge");
      socket.emit("startChallenge");

      // Clear the waiting players for this challenge
      waitingPlayers[challengeId] = [];
    } else {
      // If there's no one to challenge, add this player to the waiting list
      if (!waitingPlayers[challengeId]) {
        waitingPlayers[challengeId] = [];
      }
      waitingPlayers[challengeId].push(socket.id);
      
      // Notify the current player that they're waiting
      socket.emit("waitingForOpponent");
    }
  });

  // Listen for disconnections
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove user from any waiting list if they disconnect
    for (const challengeId in waitingPlayers) {
      waitingPlayers[challengeId] = waitingPlayers[challengeId].filter(
        (id) => id !== socket.id
      );
    }
  });
});

server.listen(PORT,(error) => {
  if(!error)
    console.log("Server is Successfully Running, and App is listening on port "+ PORT)
  else 
      console.log("Error occurred, server can't start", error);
  }
);


