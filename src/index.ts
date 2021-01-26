import express, { Application } from "express";
const app: Application = express();

// Server config
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.io config
import { Socket, Server } from "socket.io";
const socket = require("socket.io");
const io: Server = socket(server);

io.on("connection", (socket: Socket) => {
  console.log("Socket.io connected");
});
