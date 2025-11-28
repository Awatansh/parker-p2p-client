// server/config/peerServer.js
const { ExpressPeerServer } = require("peer");

function createPeerServer(httpServer, options = {}) {
  const peerServer = ExpressPeerServer(httpServer, {
    path: options.path || "/peer",
    debug: options.debug || false
  });
  return peerServer;
}

module.exports = { createPeerServer, ExpressPeerServer };
