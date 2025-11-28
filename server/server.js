require("dotenv").config();
const http = require("http");
const connectDB = require("./config/db");
const { createPeerServer } = require("./config/peerServer");

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

  // create HTTP server
  const server = http.createServer();

  // mount PeerJS signaling server FIRST (before Express app)
  const peerServer = createPeerServer(server, {
    path: process.env.PEER_PATH || "/peer",
    debug: !!process.env.PEER_DEBUG
  });

  // NOW load Express app (which includes static files and SPA fallback)
  const app = require("./app");
  server.on("request", app);

  server.listen(PORT, () => {
    console.log(`[Server] Listening on http://localhost:${PORT}`);
    console.log(`[Server] PeerJS server at http://localhost:${PORT}/peer`);
    console.log(`[Server] API base at http://localhost:${PORT}/api`);
  });
})();
