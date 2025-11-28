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

// Serve React static files (must come after API routes)
const clientBuildPath = path.join(__dirname, "../client/build");
app.use(express.static(clientBuildPath));

// Fallback: serve index.html for all other routes (SPA support)
// CRITICAL: exclude /peer paths - those are handled by PeerServer
app.get("*", (req, res) => {
  // Don't serve index.html for /peer/* routes
  if (req.path.startsWith("/peer")) {
    return res.status(404).json({ error: "Not found" });
  }
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// error handler last
app.use(errorHandler);

module.exports = app;
