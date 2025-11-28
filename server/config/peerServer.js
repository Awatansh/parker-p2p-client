// server/config/peerServer.js
// Note: PeerServer is now mounted directly in server.js
// This file is kept for potential future use

const { ExpressPeerServer } = require("peer");

function createPeerServer(httpServer, options = {}) {
  const peerServer = ExpressPeerServer(httpServer, {
    path: options.path || "/peer",
    debug: options.debug || false,
    allow_discovery: true,
    proxied: true,
    cors: {
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
    }
  });

  peerServer.on("connection", (client) => {
    console.log(`[PeerServer] Peer connected: ${client.getId()}`);
  });

  peerServer.on("disconnect", (client) => {
    console.log(`[PeerServer] Peer disconnected: ${client.getId()}`);
  });

  return peerServer;
}

module.exports = { createPeerServer, ExpressPeerServer };
