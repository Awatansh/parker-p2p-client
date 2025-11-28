require("dotenv").config();
const http = require("http");
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

  // Create HTTP server (we'll add Express to it in a moment)
  const server = http.createServer();

  // Create and configure PeerServer first
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

  // Now load Express app and attach PeerServer to it
  const app = require("./app");
  
  // Mount PeerServer as middleware BEFORE static files
  // This ensures /peer/* routes are handled by PeerServer
  app.use(peerServer);

  // Attach Express app as the request handler for the HTTP server
  server.on("request", app);

  server.listen(PORT, () => {
    console.log(`\n[Server] ✅ Server listening on port ${PORT}`);
    console.log(`[Server] 🔗 PeerJS server: wss://yourhost${peerPath}`);
    console.log(`[Server] 📡 API base: /api`);
    console.log(`[Server] 🌐 UI: https://yourhost\n`);
  });
})();
