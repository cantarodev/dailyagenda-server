const { PORT } = require("./config.js");
const express = require("express");
const app = express();
const routes = require("./routes/index.route");
const cors = require("cors");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

app.listen(PORT, () => console.log(`Server runnning on ${PORT}`));
