// server/app.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const peerRoutes = require("./routes/peerRoutes");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");

const clientBuildPath = path.join(__dirname, "../client/build");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(rateLimiter);

  // API routes - these have highest priority
  app.use("/api/peers", peerRoutes);

  // health check
  app.get("/health", (req, res) => res.json({ ok: true }));

  // Static files
  app.use(express.static(clientBuildPath));

  return app;
}

function addSPAFallback(app) {
  // SPA fallback - catch-all route for React Router
  // NOTE: This is added AFTER PeerServer middleware in server.js
  app.get("*", (req, res) => {
    // Safety check: don't serve index.html for /peer routes
    if (req.path.startsWith("/peer")) {
      return res.status(404).json({ error: "Peer route not found" });
    }
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });

  // error handler
  app.use(errorHandler);
}

module.exports = { createApp, addSPAFallback };
