// server/config/peerServer.js
const { ExpressPeerServer } = require("peer");

function createPeerServer(httpServer, options = {}) {
  const peerServer = ExpressPeerServer(httpServer, {
    path: options.path || "/peer",
    debug: options.debug || false,
    // Enable CORS for peer connections (critical for cross-origin PeerJS clients)
    cors: {
      origin: true, // Allow all origins for peer connections
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
    }
  });
  return peerServer;
}

module.exports = { createPeerServer, ExpressPeerServer };
