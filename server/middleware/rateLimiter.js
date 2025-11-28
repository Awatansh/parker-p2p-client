// server/middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

// allow 60 requests per minute per IP (adjust as needed)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: "Too many requests, slow down" }
});

module.exports = limiter;
