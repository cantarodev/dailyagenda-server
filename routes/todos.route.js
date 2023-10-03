const app = require("express");
const verifyToken = require("../middlewares/token.middleware.js");

const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteTodoAll,
} = require("../controllers/todos.controller.js");

const router = app.Router();

router.get("/:userEmail/:status", verifyToken, getTodos);

router.post("/", verifyToken, createTodo);

router.put("/:id", verifyToken, updateTodo);

router.delete("/:id", verifyToken, deleteTodo);

router.delete("/", verifyToken, deleteTodoAll);

module.exports = router;
