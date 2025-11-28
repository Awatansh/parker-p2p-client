// a lightweight PeerManager wrapper around peerjs
import Peer from "peerjs";

let instance = null;

export default function PeerManager() {
  if (instance) return instance;

  let peer = null;

  async function init() {
    return new Promise((resolve, reject) => {
      const peerServerUrl = process.env.REACT_APP_PEER_SERVER || undefined;
      const options = {};

      console.log("[PeerManager] Initializing with serverUrl:", peerServerUrl);
      console.log("[PeerManager] Peer config:", options);

      if (peerServerUrl) {
        // PeerJS client uses host/path format when connecting to a custom server.
        const url = new URL(peerServerUrl);
        options.host = url.hostname;
        options.port = url.port || undefined;
        options.path = url.pathname;
        // force secure for https
        options.secure = url.protocol === "https:";
        console.log("[PeerManager] Using custom peer server:", options);
      } else {
        console.log("[PeerManager] Using default PeerJS cloud server");
      }

      peer = new Peer(undefined, options);

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
