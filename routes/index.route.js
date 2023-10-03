const express = require("express");
const usersRoutes = require("./users.route");
const todosRoutes = require("./todos.route");
const subscriptionsRoutes = require("./subscriptions.route");

const router = express.Router();

router.use("/todos", todosRoutes);
router.use("/users", usersRoutes);
router.use("/subscriptions", subscriptionsRoutes);

module.exports = router;
