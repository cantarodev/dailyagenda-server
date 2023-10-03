const pool = require("../database/database");

const resetLoginAttempts = async (email) => {
  try {
    await pool.query("UPDATE users SET login_attempts = 0 WHERE email = ?", [
      email,
    ]);
  } catch (error) {
    console.error(error);
  }
};

const incrementLoginAttempts = async (email) => {
  try {
    await pool.query(
      "UPDATE users SET login_attempts = login_attempts + 1 WHERE email = ?",
      [email]
    );
  } catch (error) {
    console.error(error);
  }
};

const getLoginAttempts = async (email) => {
  try {
    const [rows] = await pool.query(
      "SELECT login_attempts FROM users WHERE email = ?",
      [email]
    );
    return rows[0].login_attempts;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

const lockAccount = async (email, blockedUntil) => {
  try {
    await pool.query("UPDATE users SET blocked_until = ? WHERE email = ?", [
      blockedUntil,
      email,
    ]);
  } catch (error) {
    console.error(error);
    throw new Error("Error blocking account");
  }
};

module.exports = {
  resetLoginAttempts,
  incrementLoginAttempts,
  getLoginAttempts,
  lockAccount,
};
