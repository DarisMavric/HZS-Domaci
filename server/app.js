import express from "express";
import bodyParser from "body-parser";
import connectDB from "./db.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

import userRoutes from "./api/routes/userRoutes.js";
import friendsRoutes from "./api/routes/friendsRoutes.js";
import quizRoutes from "./api/routes/quizRoutes.js";
import challengeRoutes from "./api/routes/challengeRoutes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST", "DELETE"], credentials: true }));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = process.env.PORT;
connectDB();

app.use("/api/user/", userRoutes);
app.use("/api/friends/", friendsRoutes);
app.use("/api/quiz/", quizRoutes);
app.use("/api/challenge/", challengeRoutes);

let waitingPlayers = {}; // Track waiting players by challengeId
let challengeResults = {}; // Track challenge results for both players
let playerFinishTimes = {}; // Store finish time for players

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinChallenge", ({ userId, challengeId }) => {
    if (waitingPlayers[challengeId] && waitingPlayers[challengeId].length === 1) {
      // Start the challenge when the second player joins
      io.to(socket.id).emit("startChallenge");
      waitingPlayers[challengeId].push(socket.id);
    } else {
      waitingPlayers[challengeId] = [socket.id];
      io.to(socket.id).emit("waitingForOpponent");
    }
  });

  socket.on("submitAnswer", ({ challengeId, userId, answers, correctAnswers }) => {
    // Handle answer submission
    // Optionally track the progress of the game
  });

  socket.on("finishChallenge", ({ challengeId, userId }) => {
    const otherPlayer = waitingPlayers[challengeId].find(id => id !== socket.id);

    if (!otherPlayer) {
      return; // Handle case where no other player exists
    }

    // Record finish time
    const finishTime = Date.now();
    playerFinishTimes[userId] = finishTime;

    // Log both finish times for debugging
    console.log(`Player 1 (ID: ${userId}) finished at: ${finishTime}`);
    console.log(`Player 2 (ID: ${otherPlayer}) finished at: ${playerFinishTimes[otherPlayer]}`);

    // Give a small buffer to avoid slight time discrepancies
    const buffer = 100; // 100 ms buffer

    if (playerFinishTimes[userId] < playerFinishTimes[otherPlayer] - buffer) {
      io.to(socket.id).emit("user1Wins");
      io.to(otherPlayer).emit("user2Loses");
    } else if (playerFinishTimes[userId] > playerFinishTimes[otherPlayer] + buffer) {
      io.to(socket.id).emit("user2Wins");
      io.to(otherPlayer).emit("user1Loses");
    } else {
      io.to(socket.id).emit("draw");
      io.to(otherPlayer).emit("draw");
    }

    // Cleanup after the challenge is finished
    delete waitingPlayers[challengeId];
    delete playerFinishTimes[userId];
    delete playerFinishTimes[otherPlayer];
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Handle disconnection logic
  });
});




server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
