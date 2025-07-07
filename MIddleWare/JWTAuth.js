const jwt = require("jsonwebtoken");

const ensureAuth = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: JWT token is required",
    });
  }

  try {
    // Remove "Bearer " prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next(); // ✅ Pass to next middleware/route
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: JWT token is invalid or expired",
    });
  }
};

module.exports = ensureAuth;
