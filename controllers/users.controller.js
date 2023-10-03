const pool = require("../database/database.js"); // módulo - conexiones a la database
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const {
  TOKEN_SECRET_KEY,
  MAX_LOGIN_ATTEMPTS,
  BLOCK_DURATION,
} = require("../config/config.js");
const {
  resetLoginAttempts,
  incrementLoginAttempts,
  getLoginAttempts,
  lockAccount,
} = require("../utils/auth.util.js");

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
    const token = jwt.sign({ email }, TOKEN_SECRET_KEY, {
      expiresIn: "1hr",
    });

    res.status(200).json({ email, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "The server does not respond!" });
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

    const blockedUntil = rows[0].blocked_until;
    if (blockedUntil && blockedUntil > new Date()) {
      return res.json({
        detail: `Account is blocked until ${moment(blockedUntil).format(
          "DD-MM-YYYY HH:mm:ss A"
        )}`,
      });
    }

    const success = await bcrypt.compare(password, rows[0].hashed_password);

    if (success) {
      await resetLoginAttempts(email);
      const token = jwt.sign({ email }, TOKEN_SECRET_KEY, {
        expiresIn: "1hr",
      });
      res.status(200).json({ email: rows[0].email, token });
    } else {
      await incrementLoginAttempts(email);

      const loginAttempts = await getLoginAttempts(email);
      if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        const blockedUntil = new Date(
          Date.now() + Number(BLOCK_DURATION) * 60 * 1000
        );
        await lockAccount(email, blockedUntil);
        return res.json({ detail: "Too many login attempts. Account locked." });
      }

      res.status(401).json({ detail: "Login failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "The server does not respond!" });
  }
};

module.exports = {
  signupUser,
  loginUser,
};
