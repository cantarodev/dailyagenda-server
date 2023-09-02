const pool = require("../database/database.js"); // módulo - conexiones a la database
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

// get all todos
const getTodos = async (req, res) => {
  const { userEmail } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM todos WHERE user_email = ?",
      [userEmail]
    );
    res.json(rows);
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
  const { user_email, title, progress, date } = req.body;

  const originalDate = moment(date, "DD/MM/YYYY HH:mm:ss");
  const desiredDate = originalDate.format("YYYY-MM-DD HH:mm:ss");
  try {
    const editToDo = await pool.query(
      "UPDATE todos SET user_email=?, title=?, progress=?, date=? WHERE id=?",
      [user_email, title, progress, desiredDate, id]
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

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteTodoAll,
};
