// server/config/peerServer.js
const { ExpressPeerServer } = require("peer");

function createPeerServer(httpServer, options = {}) {
  const peerServer = ExpressPeerServer(httpServer, {
    path: options.path || "/peer",
    debug: options.debug || false,
    // Connection options for production stability
    allow_discovery: true,
    proxied: true, // Important for Render (behind proxy)
    // Enable CORS for peer connections
    cors: {
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
    },
    // Socket.io configuration for better WebSocket handling
    config: {
      iceServers: [
        { urls: ['stun:stun.l.google.com:19302'] },
        { urls: ['stun:stun1.l.google.com:19302'] },
      ]
    }
  });

  // Log peer events for debugging
  peerServer.on("connection", (client) => {
    console.log(`[PeerServer] Peer connected: ${client.getId()}`);
  });

  peerServer.on("disconnect", (client) => {
    console.log(`[PeerServer] Peer disconnected: ${client.getId()}`);
  });

  return peerServer;
}

module.exports = { createPeerServer, ExpressPeerServer };
