// server/models/Peer.js
const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, default: 0 },
  keywords: { type: [String], index: true } // prefix tokens stored here, lowercase
}, { _id: false });

const PeerSchema = new mongoose.Schema({
  peerId: { type: String, unique: true, required: true },
  username: { type: String, default: "anonymous" },
  files: [FileSchema],
  lastHeartbeat: { type: Date, default: Date.now }
});

// TTL: remove peers that haven't updated heartbeat
const ttlSeconds = Number(process.env.HEARTBEAT_TTL_SECONDS) || 30;
PeerSchema.index({ lastHeartbeat: 1 }, { expireAfterSeconds: ttlSeconds });

// index for fast prefix lookup (equality on tokens)
PeerSchema.index({ "files.keywords": 1 });

module.exports = mongoose.model("Peer", PeerSchema);
