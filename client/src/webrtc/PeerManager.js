// a lightweight PeerManager wrapper around peerjs
import Peer from "peerjs";

let instance = null;

export default function PeerManager() {
  if (instance) return instance;

  let peer = null;

  async function init() {
    return new Promise((resolve, reject) => {
      // Production config: connect to current origin (same domain to avoid CORS)
      // For local dev: use localhost:9000
      // For production: use current window.location.host
      let host, port, secure;
      
      if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
        // Production: use same domain to avoid CORS issues
        host = window.location.hostname;
        port = 443;
        secure = true;
      } else {
        // Development: use localhost
        host = process.env.REACT_APP_PEER_HOST || "localhost";
        port = parseInt(process.env.REACT_APP_PEER_PORT || "9000");
        secure = process.env.REACT_APP_PEER_SECURE === "true" || false;
      }

      const peerConfig = {
        host,
        port,
        path: process.env.REACT_APP_PEER_PATH || "/peer",
        secure,
        debug: 2,
      };

      console.log("[PeerManager] Initializing with config:", peerConfig);
      console.log("[PeerManager] Environment:", process.env.NODE_ENV);
      console.log("[PeerManager] Origin:", typeof window !== "undefined" ? window.location.origin : "N/A");

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
