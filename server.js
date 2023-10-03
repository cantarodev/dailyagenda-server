require("dotenv").config();
const app = require("./app");
const sockets = require("./socket/socket");

const { Server } = require("socket.io");
const http = require("http");

const { PORT, FRONT_URL } = require("./config/config");

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server runnning on ${PORT}`));

const io = new Server(server, {
  cors: {
    origin: FRONT_URL,
  },
});
sockets(io);
