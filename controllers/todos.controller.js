const pool = require("../database/database.js"); // módulo - conexiones a la database
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const notifier = require("node-notifier");
const path = require("path");
const opn = require("opn");

// get all todos
const getTodos = async (req, res) => {
  const { userEmail, status } = req.params;
  try {
    let queryStatus = "";
    let valueConditions = [userEmail];
    status !== "all" &&
      ((queryStatus = "AND status = ?"), valueConditions.push(status));

    const [rows] = await pool.query(
      `SELECT * FROM todos WHERE user_email = ? ${queryStatus} ORDER BY date`,
      [...valueConditions]
    );
    res.json(rows);

    if (rows.length > 0) {
      setInterval(async () => {
        const [results] = await pool.query(
          "SELECT * FROM todos WHERE user_email = ? AND date <= NOW()",
          [userEmail]
        );
        if (results.length > 0) {
          results.forEach((task) => {
            changeStatusTodo(task);
          });

          results
            .filter((task) => task.notified === 0)
            .forEach((task) => {
              sendNotification(task);
            });
        }
      }, 10000);
    }
  } catch (error) {
    console.log(error);
  }
};

// create a new task
const createTodo = async (req, res) => {
  const { user_email, title, progress, date } = req.body;
  const id = uuidv4();
  const originalDate = moment(date, "DD/MM/YYYY HH:mm:ss");
  const desiredDate = originalDate.format("YYYY-MM-DD HH:mm:ss");

  try {
    const newToDo = await pool.query(
      "INSERT INTO todos(id, user_email, title, progress, date) VALUES(?, ?, ?, ?, ?)",
      [id, user_email, title, progress, desiredDate]
    );
    res.json(newToDo);
  } catch (error) {
    console.error(error);
  }
};

// edit a task
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, notified, status, date } = req.body;

  const originalDate = moment(date, "DD/MM/YYYY HH:mm:ss");
  const desiredDate = originalDate.format("YYYY-MM-DD HH:mm:ss");
  const currentDate = moment();
  try {
    let changeNotified =
      Number(progress) < 100 && currentDate.isBefore(desiredDate)
        ? 0
        : notified;
    let changeStatus =
      Number(progress) === 100
        ? "complete"
        : Number(progress) < 100 && currentDate.isBefore(desiredDate)
        ? "pending"
        : status;
    const editToDo = await pool.query(
      `UPDATE todos SET user_email=?, title=?, progress=?, notified=?, status=?, date=? WHERE id=?`,
      [
        user_email,
        title,
        progress,
        changeNotified,
        changeStatus,
        desiredDate,
        id,
      ]
    );
    res.json(editToDo);
  } catch (error) {
    console.error(error);
  }
};

// delete a todo
const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteToDo = pool.query("DELETE FROM todos WHERE id=?", [id]);
    res.json(deleteToDo);
  } catch (error) {
    console.log(error);
  }
};

// delete all todos
const deleteTodoAll = async (req, res) => {
  try {
    const deleteToDo = pool.query("DELETE FROM todos");
    res.json(deleteToDo);
  } catch (error) {
    console.log(error);
  }
};

const sendNotification = async (task) => {
  notifier.notify({
    title: "Tarea pendiente",
    message: task.title,
    icon: path.join(__dirname, "../img/list.png"),
    image: path.join(__dirname, "../img/list.png"),
    sound: true,
    wait: true,
  });
  await pool.query("UPDATE todos SET notified = 1 WHERE id=?", [task.id]);
};

// Función para abrir o redirigir a una URL
const openOrRedirect = (url) => {
  opn(url, { wait: true }).catch((err) => {
    console.error(err);
  });
};

// Configuramos el evento 'click' de la notificación
notifier.on("click", function () {
  // Abrimos la página web en el navegador
  openOrRedirect("http://localhost:3000");
});

const changeStatusTodo = async (task) => {
  try {
    await pool.query(
      "UPDATE todos SET status = 'in progress' WHERE id=? AND progress < 100",
      [task.id]
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteTodoAll,
};
