// server/controllers/peerController.js
const Peer = require("../models/Peer");
const keywordGenerator = require("../utils/keywordGenerator");
const sanitize = require("../utils/sanitize");

exports.announce = async (req, res, next) => {
  try {
    const { peerId, username, files } = req.body;
    if (!peerId) return res.status(400).json({ error: "peerId required" });
    if (!Array.isArray(files)) return res.status(400).json({ error: "files must be array" });

    const processedFiles = files.map(f => {
      const name = sanitize.string(f.name || "");
      const size = Number(f.size || 0);
      const keywords = keywordGenerator(name);
      return { name, size, keywords };
    });

    const updated = await Peer.findOneAndUpdate(
      { peerId },
      {
        peerId,
        username: sanitize.string(username || "anonymous"),
        files: processedFiles,
        lastHeartbeat: Date.now()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("[Controller] Announced peer:", peerId, "files:", processedFiles.length);
    return res.json({ success: true, peer: { peerId: updated.peerId, username: updated.username } });
  } catch (err) {
    console.error("[Controller] Announce error:", err.message);
    next(err);
  }
};

exports.heartbeat = async (req, res, next) => {
  try {
    const { peerId } = req.body;
    if (!peerId) return res.status(400).json({ error: "peerId required" });

    const updated = await Peer.findOneAndUpdate({ peerId }, { lastHeartbeat: Date.now() }, { new: true });
    if (!updated) return res.status(404).json({ error: "peer not found" });

    console.log("[Controller] Heartbeat updated for peer:", peerId);
    return res.json({ ok: true });
  } catch (err) {
    console.error("[Controller] Heartbeat error:", err.message);
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const raw = req.query.q || "";
    const q = sanitize.string(raw).toLowerCase().trim();
    if (!q) {
      console.log("[Controller] Empty search query, returning empty results");
      return res.json([]);
    }

    console.log("[Controller] Searching for:", q);

    const peers = await Peer.find({ "files.keywords": q }).select("peerId username files");
    const results = peers
      .map(p => {
        const matchedFiles = (p.files || [])
          .filter(f => (f.keywords || []).includes(q))
          .map(f => ({ name: f.name, size: f.size }));
        return { peerId: p.peerId, username: p.username, files: matchedFiles };
      })
      .filter(r => r.files.length > 0);

    console.log("[Controller] Search results for '" + q + "':", results.length, "peers found");
    res.json(results);
  } catch (err) {
    console.error("[Controller] Search error:", err.message);
    next(err);
  }
};
