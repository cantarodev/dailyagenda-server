const jwt = require("jsonwebtoken");
const { TOKEN_SECRET_KEY } = require("../config/config");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Token not provided." });
  }

  jwt.verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Expired or invalid token." });
    }

    req.user = decoded;

    next();
  });
};

module.exports = verifyToken;
