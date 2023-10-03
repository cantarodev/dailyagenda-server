const webpush = require("../webpush/webpush");
const pool = require("../database/database");

const sendNotification = async (task) => {
  const payload = JSON.stringify({
    title: task.title,
    date: task.date,
  });
  const userSubscriptions = await getSubscriptionsByUser(task.user_email);
  userSubscriptions.forEach(async (pushSubscription) => {
    await webpush.sendNotification(pushSubscription, payload);
  });
};

const changeStatusTodo = async (taskId) => {
  try {
    await pool.query(
      "UPDATE todos SET status = 'in progress' WHERE progress < 100 AND id = ?",
      [taskId]
    );
  } catch (error) {
    console.log(error);
  }
};

const changePreNotifiedTodo = async (taskIds) => {
  try {
    await pool.query("UPDATE todos SET pre_notified = 1 WHERE id IN (?)", [
      taskIds,
    ]);
  } catch (error) {
    console.log(error);
  }
};

const changeNotifiedTodo = async (taskId) => {
  try {
    await pool.query("UPDATE todos SET notified = 1 WHERE id = ?", [taskId]);
  } catch (error) {
    console.log(error);
  }
};

const getSubscriptionsByUser = async (userEmail) => {
  try {
    const [rows] = await pool.query(
      `SELECT endpoint FROM subscriptions WHERE user_email = ?`,
      [userEmail]
    );
    if (rows.length > 0) return rows.map((sub) => JSON.parse(sub.endpoint));
    return [];
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendNotification,
  changeStatusTodo,
  changePreNotifiedTodo,
  changeNotifiedTodo,
};
