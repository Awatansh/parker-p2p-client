// server/app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const peerRoutes = require("./routes/peerRoutes");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// API routes
app.use("/api/peers", peerRoutes);

// health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Serve React static files
const clientBuildPath = path.join(__dirname, "../client/build");
app.use(express.static(clientBuildPath));

// Fallback: serve index.html for SPA (catch-all)
// NOTE: /peer/* requests are handled by PeerServer mounted on HTTP server in server.js
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// error handler
app.use(errorHandler);

module.exports = app;
