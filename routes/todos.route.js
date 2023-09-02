const app = require("express");
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteTodoAll,
} = require("../controllers/todos.controller.js");

const router = app.Router();

router.get("/:userEmail", getTodos);

router.post("/", createTodo);

router.put("/:id", updateTodo);

router.delete("/:id", deleteTodo);

router.delete("/", deleteTodoAll);

module.exports = router;
