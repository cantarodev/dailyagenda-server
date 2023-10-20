const express = require("express");
const cors = require("cors");
const routes = require("./routes/index.route");
const { FRONT_URL } = require("./config/config");

const app = express();

const corsOptions = {
  origin: FRONT_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1", routes);

module.exports = app;
