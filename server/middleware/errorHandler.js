// server/middleware/errorHandler.js
module.exports = function (err, req, res, next) {
  console.error(err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "internal_server_error", message: err.message || "An error occurred" });
};
