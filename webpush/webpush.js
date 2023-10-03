const webpush = require("web-push");
const {
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY,
  EMAIL,
} = require("../config/config");

webpush.setVapidDetails(`mailto:${EMAIL}`, PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

module.exports = webpush;
