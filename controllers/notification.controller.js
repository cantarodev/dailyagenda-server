const moment = require("moment");
const pool = require("../database/database");
const {
  sendNotification,
  changeStatusTodo,
  changePreNotifiedTodo,
  changeNotifiedTodo,
} = require("../utils/notification.util");

const joinUserSocket = (io, socket) => {
  socket.on("subscribeToTasks", (userEmail) => {
    socket.join(userEmail);
    socket.emit("successfulSubscription", true);
  });
};

const getNotification = (io, socket) => {
  socket.on("notification", (userEmail) => {
    const checkNotifications = async () => {
      try {
        const [results] = await pool.query(
          "SELECT * FROM todos WHERE user_email = ? AND date <= DATE_ADD(UTC_TIMESTAMP(), INTERVAL 5 MINUTE)",
          [userEmail]
        );
        if (results.length > 0) {
          const tasksPreToSend = results.filter(
            (task) => task.pre_notified === 0
          );
          const tasksToSend = results.filter(
            (task) => task.notified === 0 && task.pre_notified === 1
          );

          const taskPreNotifiedIds = tasksPreToSend.map((task) => task.id);
          tasksPreToSend.forEach((task, index) => {
            sendNotification(task);
            tasksPreToSend.splice(index, 1);
          });

          if (taskPreNotifiedIds.length > 0) {
            changePreNotifiedTodo(taskPreNotifiedIds);
          }

          tasksToSend.forEach((task, index) => {
            const now = moment();
            const date = moment(task.date);
            if (now >= date) {
              io.to(task.user_email).emit("changeStatusProcess", true);
              sendNotification(task);
              changeNotifiedTodo(task.id);
              changeStatusTodo(task.id);
              tasksToSend.splice(index, 1);
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkNotifications();
    setInterval(checkNotifications, 10000);
  });
};

const getTodos = (io, socket) => {
  socket.on("getTodos", async (params) => {
    const { userEmail, sendToUser } = params;
    try {
      const [rows] = await pool.query(
        `SELECT * FROM todos WHERE user_email = ? ORDER BY date`,
        [userEmail]
      );
      sendToUser === "all"
        ? io.to(userEmail).emit("getListTodos", rows)
        : io.to(socket.id).emit("getListTodos", rows);
    } catch (error) {
      console.error(error);
    }
  });
};

module.exports = { joinUserSocket, getNotification, getTodos };
