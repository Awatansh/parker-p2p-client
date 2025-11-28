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

// API routes (highest priority - must match before fallback)
app.use("/api/peers", peerRoutes);

// health check
app.get("/health", (req, res) => res.json({ ok: true }));

// PeerServer middleware will be added here in server.js before static files
// (This prevents SPA fallback from intercepting /peer routes)

// Serve React static files
const clientBuildPath = path.join(__dirname, "../client/build");
app.use(express.static(clientBuildPath));

// Fallback: serve index.html for all other routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// error handler last
app.use(errorHandler);

module.exports = app;
