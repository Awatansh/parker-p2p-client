// server/routes/peerRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/peerController");

// announce: register peer and files (upsert)
router.post("/announce", controller.announce);

// heartbeat: update lastHeartbeat
router.put("/heartbeat", controller.heartbeat);

// search: ?q=term
router.get("/search", controller.search);

module.exports = router;
