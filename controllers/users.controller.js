const pool = require("../database/database.js"); // módulo - conexiones a la database
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    const signUp = await pool.query(
      `INSERT INTO users(email, hashed_password) VALUES(?, ?)`,
      [email, hashedPassword]
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    res.json({ email, token });
  } catch (error) {
    console.error(error);
    if (error) {
      res.json({ detail: error.detail });
    }
  }
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!rows.length) return res.json({ detail: "User does not exist!" });

    const success = await bcrypt.compare(password, rows[0].hashed_password);
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    if (success) {
      res.json({ email: rows[0].email, token });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  signupUser,
  loginUser,
};
