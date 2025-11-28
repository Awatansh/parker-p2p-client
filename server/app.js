// server/app.js
const express = require("express");
const cors = require("cors");
const peerRoutes = require("./routes/peerRoutes");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// API
app.use("/api/peers", peerRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

// error handler last
app.use(errorHandler);

module.exports = app;
