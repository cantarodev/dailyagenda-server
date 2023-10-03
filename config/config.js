const PORT = process.env.PORT;

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;

const PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY;
const PRIVATE_VAPID_KEY = process.env.PRIVATE_VAPID_KEY;

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

const EMAIL = process.env.EMAIL;

const FRONT_URL = process.env.FRONT_URL;

const MAX_LOGIN_ATTEMPTS = process.env.MAX_LOGIN_ATTEMPTS;
const BLOCK_DURATION = process.env.BLOCK_DURATION;

module.exports = {
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY,
  TOKEN_SECRET_KEY,
  EMAIL,
  FRONT_URL,
  MAX_LOGIN_ATTEMPTS,
  BLOCK_DURATION,
};
