const pool = require("../database/database.js");
const { v4: uuidv4 } = require("uuid");

const createSubscription = async (req, res) => {
  const { userEmail, subscription } = req.body;
  const id = uuidv4();

  try {
    const [existingSubscription] = await pool.query(
      "SELECT * FROM subscriptions WHERE user_email = ? AND endpoint = ?",
      [userEmail, JSON.stringify(subscription)]
    );

    if (existingSubscription.length <= 0) {
      await pool.query(
        "INSERT INTO subscriptions(id, user_email, endpoint) VALUES(?, ?, ?)",
        [id, userEmail, JSON.stringify(subscription)]
      );
      res.status(200).send("Subscription saved successfully");
    } else {
      res.status(404).send("Subscription already exists");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { createSubscription };
