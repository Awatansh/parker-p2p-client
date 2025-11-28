require("dotenv").config();
const http = require("http");
const connectDB = require("./config/db");
const { ExpressPeerServer } = require("peer");
const { createApp, addSPAFallback } = require("./app");

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

  // Create Express app (WITHOUT the SPA fallback yet)
  const app = createApp();

  // Create HTTP server
  const server = http.createServer(app);

  // Create PeerServer on the HTTP server
  const peerPath = process.env.PEER_PATH || "/peer";
  console.log("[Server] Setting up PeerJS at path: " + peerPath);

  const peerServer = ExpressPeerServer(server, {
    path: peerPath,
    debug: !!process.env.PEER_DEBUG,
    allow_discovery: true,
    proxied: true,
    cors: {
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
    }
  });

  // Mount PeerServer as middleware BEFORE SPA fallback
  app.use(peerServer);

  // NOW add the SPA fallback (it will be the last route, after PeerServer)
  addSPAFallback(app);

  // Log peer events
  peerServer.on("connection", (client) => {
    console.log(`[PeerServer] ✅ Peer connected: ${client.getId()}`);
  });

  peerServer.on("disconnect", (client) => {
    console.log(`[PeerServer] Peer disconnected: ${client.getId()}`);
  });

  peerServer.on("error", (err) => {
    console.error("[PeerServer] Error:", err);
  });

  server.listen(PORT, () => {
    console.log(`\n[Server] ✅ Server listening on port ${PORT}`);
    console.log(`[Server] 🔗 PeerJS server: ${peerPath}`);
    console.log(`[Server] 📡 API base: /api\n`);
  });
})();
