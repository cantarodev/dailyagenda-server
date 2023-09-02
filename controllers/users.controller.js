const pool = require("../database/database.js"); // módulo - conexiones a la database
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const notifier = require("node-notifier");
const path = require("path");
const openurl = require("openurl");

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
      setInterval(async () => {
        const [results] = await pool.query(
          "SELECT * FROM todos WHERE user_email = ? AND date <= NOW() AND notified = 0",
          [rows[0].email]
        );
        if (results.length > 0) {
          results.forEach((task) => {
            sendNotification(task);
          });
        }
      }, 10000);
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (error) {
    console.error(error);
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
  const [rows] = await pool.query("UPDATE todos SET notified = 1 WHERE id=?", [
    task.id,
  ]);
};

// Función para abrir o redirigir a una URL
const openOrRedirect = (url) => {
  openurl.exists(url, (err, isExists) => {
    if (isExists) {
      openurl.open(url);
    } else {
      openurl.open(url, { newInstance: true });
    }
  });
};

// Configuramos el evento 'click' de la notificación
notifier.on("click", function () {
  // Abrimos la página web en el navegador
  openOrRedirect("http://localhost:3000");
});

module.exports = {
  signupUser,
  loginUser,
};
