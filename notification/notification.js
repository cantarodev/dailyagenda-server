const pool = require("../database/database");

// Función para obtener la lista de tareas pendientes
const getPendingTasks = async (req, res) => {
    const { userEmail } = req.params;

    // Llamar a la función para obtener la lista de tareas del usuario
    obtenerTareas(userEmail, (error, tasks) => {
      if (error) {
        return res.status(500).json({ error: 'Error al obtener las tareas' });
      }
      tasks.forEach((task) => {
        sendNotification(task);
      });
    });
};

// Función que obtiene la lista de tareas del usuario
const obtenerTareas = (user_email, callback) => {
  const sql =
    "SELECT * FROM todos WHERE date <= NOW() AND notified = 0 AND user_email = ?";
  pool.query(sql, [user_email], (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
}

// Función para enviar la notificación
const sendNotification = async (task) => {
  notifier.notify({
    title: "Tarea pendiente",
    message: task.title,
    sound: true,
  });
  try {
    const edit = await pool.query(
      "UPDATE todos SET notified = 1 WHERE id = ?",
      [task.id]
    );
  } catch (error) {
    console.log(error);
  }
};

const checkPendingTasks = () => {
    getPendingTasks((tasks) => {
      tasks.forEach((task) => {
        sendNotification(task);
      });
    });
  }
  

module.exports = getPendingTasks;
