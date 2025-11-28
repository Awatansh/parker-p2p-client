require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { ExpressPeerServer } = require("peer");

const PORT = process.env.PORT || 5000;

(async () => {
  // REQUIRED: Connect MongoDB
  if (!process.env.MONGO_URI) {
    console.error("[Server] FATAL: MONGO_URI not set. MongoDB is required for production.");
    console.error("[Server] Set MONGO_URI environment variable (e.g., mongodb+srv://user:pass@cluster.mongodb.net/parker)");
    process.exit(1);
  }

  try {
    await connectDB(process.env.MONGO_URI);
    console.log("[Server] MongoDB connected successfully");
  } catch (err) {
    console.error("[Server] FATAL: MongoDB connection failed:", err.message);
    console.error("[Server] Check your MONGO_URI and ensure MongoDB is running/accessible");
    process.exit(1);
  }

  // create HTTP server from express app
  const server = http.createServer(app);

  // mount PeerJS signaling server directly on HTTP server
  // ExpressPeerServer handles both HTTP and WebSocket on the specified path
  const peerServer = ExpressPeerServer(server, {
    path: process.env.PEER_PATH || "/peer",
    debug: !!process.env.PEER_DEBUG,
    allow_discovery: true,
    proxied: true, // Critical for Render (behind reverse proxy)
    cors: {
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
    }
  });

  // Log peer events
  peerServer.on("connection", (client) => {
    console.log(`[PeerServer] Peer connected: ${client.getId()}`);
  });

  peerServer.on("disconnect", (client) => {
    console.log(`[PeerServer] Peer disconnected: ${client.getId()}`);
  });

  server.listen(PORT, () => {
    console.log(`[Server] Listening on port ${PORT}`);
    console.log(`[Server] PeerJS server at /${process.env.PEER_PATH || "peer"}`);
    console.log(`[Server] API base at /api`);
  });
})();
