// a lightweight PeerManager wrapper around peerjs
import Peer from "peerjs";

let instance = null;

export default function PeerManager() {
  if (instance) return instance;

  let peer = null;

  async function init() {
    return new Promise((resolve, reject) => {
      // Production config with environment variables
      const peerConfig = {
        host: process.env.REACT_APP_PEER_HOST || "parker-app.onrender.com",
        port: parseInt(process.env.REACT_APP_PEER_PORT || "443"),
        path: process.env.REACT_APP_PEER_PATH || "/peer",
        secure: process.env.REACT_APP_PEER_SECURE === "true" || true,
        debug: 2,
      };

      console.log("[PeerManager] Initializing with config:", peerConfig);
      console.log("[PeerManager] Environment:", process.env.NODE_ENV);

      peer = new Peer(undefined, peerConfig);

      peer.on("open", id => {
        console.log("[PeerManager] Peer open:", id);
        resolve(id);
      });
      peer.on("error", err => {
        console.error("[PeerManager] Peer error:", err);
        console.error("[PeerManager] Error details:", err.type, err.message);
        reject(err);
      });

      // incoming data connections - example handler
      peer.on("connection", conn => {
        console.log("Incoming peer connection", conn.peer);
        conn.on("data", data => {
          // handle if needed: e.g., request metadata or chunk transfer signals
          console.log("data from", conn.peer, data);
        });
      });
    });
  }

  function connect(peerId) {
    if (!peer) throw new Error("Peer not initialized");
    const conn = peer.connect(peerId);
    return conn;
  }

  function getInstance() {
    return peer;
  }

  instance = { init, connect, getInstance };
  return instance;
}
