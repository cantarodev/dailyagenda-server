const express = require("express");
const {
  createSubscription,
} = require("../controllers/subscriptions.controller.js");

const router = express.Router();

router.post("/", createSubscription);

module.exports = router;
