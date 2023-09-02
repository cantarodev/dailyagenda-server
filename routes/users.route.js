const app = require("express");
const { signupUser, loginUser } = require("../controllers/users.controller");

const router = app.Router();

router.post("/signup", signupUser);

router.post("/login", loginUser);

module.exports = router;
