// Dotenv config
import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
const app: Application = express();

// Server config
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import cors from "cors";
app.use(cors());
app.use(express.json());

// Routes
import usersRouter from "./routes/users";
app.use("/api/users", usersRouter);

// Socket.io config
import { Socket, Server } from "socket.io";
const socket = require("socket.io");
const io: Server = socket(server);

interface Message {
  message: string;
  sender_id: number;
  recipient_id: number;
}

io.on("connection", (socket: Socket) => {
  console.log("Socket.io connected");

  socket.join(socket.handshake.query.id);

  socket.on("send-message", (message: Message) => {
    io.to(message.recipient_id.toString()).emit("receive-message", message);
  });
});
