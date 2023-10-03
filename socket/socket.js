const {
  joinUserSocket,
  getNotification,
  getTodos,
} = require("../controllers/notification.controller");

const sockets = (io) => {
  io.on("connection", (socket) => {
    console.log("New user connected");
    joinUserSocket(io, socket);
    getNotification(io, socket);
    getTodos(io, socket);

    socket.on("error", (error) => {
      console.error(`Error in the socket: ${error}`);
      setTimeout(() => {
        socket.connect();
      }, 5000);
    });
  });
};

module.exports = sockets;
