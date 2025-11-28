# Parker (P2P File Sharing - Napster Clone)

## Group - 16 Distributed Systems Project

### 231020416 - AVIJEET PARTH SONI

### 231020417 - AWATANSH SINGH

### 231020418 - AYUSH DEEP

### 231020421 - DEVASMITA MAJHI

A decentralized peer-to-peer file sharing application using WebRTC (PeerJS) for data transfer and Express.js backend for peer discovery and file indexing.

## Quick Start

### Prerequisites

- Node.js v16+
- npm or yarn
- Git
- MongoDB (optional for dev, will run without it)

### Installation & Run (Development)

#### Option 1: Run Both Server & Client from Root

```bash
# Clone repository
git clone https://github.com/Awatansh/parker-p2p-client.git
cd parker

# Install all dependencies
npm run install-all

# Terminal 1: Start Backend Server
npm run server

# Terminal 2: Start Frontend (in new terminal from parker root)
npm run client

# App opens at http://localhost:3000
```

#### Option 2: Run Manually (More Control)

```bash
# Terminal 1: Backend
cd server
npm install
npm run dev
# Output: [Server] ✅ Server listening on port 5000
# Output: [Server] 🔗 PeerJS server: /peer

# Terminal 2: Frontend (in new terminal)
cd client
npm install
npm start
# Opens http://localhost:3000 automatically
# Browser console should show: [App] PeerManager instance created
```

#### Option 3: Using Individual Commands

```bash
# Build and start production
npm run build  # Builds React client
npm start      # Starts Express server on port 5000

# The server will serve React from client/build/
# Visit http://localhost:5000
```

### Environment Setup (Optional)

Create `.env` files if you want to customize:

**server/.env:**

```env
MONGO_URI=mongodb://localhost:27017/parker
PORT=5000
PEER_PATH=/peer
PEER_DEBUG=false
NODE_ENV=development
HEARTBEAT_TTL_SECONDS=30
```

**client/.env:**

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PEER_HOST=localhost
REACT_APP_PEER_PORT=9000
REACT_APP_PEER_PATH=/peer
REACT_APP_PEER_SECURE=false
REACT_APP_HEARTBEAT_INTERVAL_MS=10000
```

### First-Time Setup with MongoDB (Persistent Data)

```bash
# 1. Install MongoDB locally or use MongoDB Atlas
# Option A: Local (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Option B: MongoDB Atlas (Cloud)
# Create account at https://www.mongodb.com/cloud/atlas
# Get connection string: mongodb+srv://user:pass@cluster.mongodb.net/parker

# 2. Set MONGO_URI in server/.env
MONGO_URI=mongodb://localhost:27017/parker  # Local
# OR
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/parker  # Atlas

# 3. Start server
cd server
npm run dev
# Output should include: [Server] MongoDB connected successfully
```

### Verify Installation

Open browser console (F12) and check for these logs:

✅ **Good Setup:**

```
[API] Initializing with base URL: http://localhost:5000/api
[App] Initializing PeerManager
[PeerManager] Initializing with config: {host: 'localhost', port: 9000, ...}
[PeerManager] Peer open: <UUID>
[App] Successfully initialized peer with ID: <UUID>
[useHeartbeat] Starting heartbeat every 10000 ms
```

❌ **Common Issues:**

- `[PeerManager] Peer error` → Backend not running on port 5000
- `[useHeartbeat] Peer not found on server` → Server connection lost
- `Cannot GET /api/peers/search` → Server not running

### Project Structure for Development

```
parker/
├── server/
│   ├── server.js              # Entry point
│   ├── app.js                 # Express app setup
│   ├── package.json
│   ├── config/
│   │   ├── db.js             # MongoDB connection
│   │   └── peerServer.js     # PeerJS config
│   ├── controllers/
│   │   └── peerController.js # API logic
│   ├── models/
│   │   └── Peer.js           # MongoDB schema
│   ├── routes/
│   │   └── peerRoutes.js
│   ├── middleware/
│   ├── utils/
│   └── .env                  # Your local config
│
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js            # Main component
│   │   ├── styles.css        # 436 lines, modern design
│   │   ├── api/
│   │   │   └── backend.js    # HTTP client
│   │   ├── components/       # React components
│   │   ├── hooks/
│   │   │   └── useHeartbeat.js
│   │   ├── webrtc/
│   │   │   └── PeerManager.js # WebRTC wrapper
│   │   └── context/
│   │       └── PeerContext.js # Global state
│   ├── package.json
│   ├── .env                  # Your local config
│   └── .env.production       # Production config
│
├── package.json              # Root (monorepo)
├── build.sh                  # Render deployment script
└── .env                      # Root config (git-ignored)
```

## Architecture

**Control Plane (Centralized):**

- Backend (Express): Peer discovery, file indexing, search
- Database (MongoDB): Peer metadata with TTL expiration
- PeerJS Server: WebRTC signaling

**Data Plane (Decentralized):**

- Direct peer-to-peer WebRTC connections
- Encrypted file transfer via data channels

## Key Features

- ✅ **Real-Time Peer Discovery**: Files searchable immediately after upload
- ✅ **Keyword Generation**: Intelligent tokenization + prefix matching for smart search
- ✅ **TTL-Based Expiration**: Auto-cleanup of offline peers (30-second timeout)
- ✅ **Heartbeat System**: 10-second keep-alive pings maintain peer registration
- ✅ **Direct P2P Transfer**: WebRTC data channels for privacy and speed
- ✅ **Hybrid Architecture**: Centralized coordination + decentralized data transfer
- ✅ **Modern UI**: React 18 with gradient theme and smooth animations
- ✅ **Production Ready**: Deployed on Render.com with MongoDB Atlas
- ✅ **Full Logging**: Comprehensive console logs for debugging

## Unique Technical Features

1. **Automatic Keyword Generator** - Breaks filenames into searchable tokens with prefix matching

   - Example: `"vacation photo 2025.mp4"` → `["vacation", "photo", "2025", "mp4", "vac", "va", ...]`

2. **TTL-Based Self-Cleaning Network** - MongoDB TTL index auto-deletes stale peers

   - No manual cleanup needed
   - Always reflects active participants

3. **Stateful Heartbeat Hook** - Custom React hook sends keep-alive every 10 seconds

   - Engine powering TTL expiration
   - Lightweight and efficient

4. **Dynamic Peer Configuration** - Same code works locally and in production

   - Development: `localhost:9000`
   - Production: Auto-detects and uses same domain

5. **Monorepo Build System** - Single command deploys both frontend and backend
   - `build.sh` orchestrates clean, sequential builds

## Deployment

### Deploy to Render.com

1. **Connect GitHub**

   - Push to GitHub: `git push origin master`
   - Create new Web Service on Render.com
   - Connect to `Awatansh/parker-p2p-client` repo

2. **Configure Environment**

   ```env
   NODE_ENV=production
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/parker
   PORT=10000  # Render assigns this
   PEER_PATH=/peer
   CORS_ORIGIN=https://your-app.onrender.com
   ```

3. **Set Build & Start Commands**

   - Build: `bash build.sh`
   - Start: `node server/server.js`

4. **Deploy**
   - Click "Create Web Service"
   - Auto-deploys on git push
   - Live at `https://your-app.onrender.com`

### Deploy to Other Platforms

The `build.sh` script works on any Node.js platform:

- Heroku: `git push heroku master`
- Vercel: Push to `vercel` branch
- DigitalOcean: Use App Platform
- AWS: EC2 or Elastic Beanstalk

## Performance

- **Search Latency**: <100ms (indexed MongoDB queries)
- **Peer Connection Time**: 1-3 seconds (WebRTC signaling)
- **File Transfer Speed**: Limited only by peer bandwidth
- **Concurrent Peers**: 1000+ (database dependent)
- **Server Bandwidth**: Minimal (only signaling, no data)

## Technology Stack

| Component     | Technology                        |
| ------------- | --------------------------------- |
| Frontend      | React 18.2, WebRTC (PeerJS 1.4.7) |
| Backend       | Express 4.18, Node.js 16+         |
| Database      | MongoDB 7.3 + Mongoose            |
| P2P Signaling | PeerJS Server 0.6.1               |
| HTTP Client   | Axios 1.4.0                       |
| Testing       | Jest + React Testing Library      |
| Deployment    | Render.com, MongoDB Atlas         |

## Troubleshooting

### Backend Won't Start

```
Error: EADDRINUSE :::5000
```

**Solution:** Port 5000 already in use

```bash
# Kill existing process on port 5000 (macOS/Linux)
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### PeerID: not connected

**Symptom:** Console shows `[PeerManager] Peer error: server-error` or `Cannot get ID from server`

**Solutions:**

1. Ensure backend is running:
   ```bash
   cd server && npm run dev
   ```
2. Check PeerManager logs match your setup:
   - Local dev: Should show `localhost:9000`
   - Production: Should show your domain
3. Verify config in `client/.env`:
   ```
   REACT_APP_PEER_HOST=localhost
   REACT_APP_PEER_PORT=9000
   REACT_APP_PEER_SECURE=false
   ```
4. Check browser console (F12) for:
   - `[API] Initializing with base URL: http://localhost:5000/api`
   - `[PeerManager] Initializing with config:`

### Search not working

**Symptom:** No results even after uploading files

**Solutions:**

1. Upload files first:
   - Click "Share Files" → Select files → Files should appear in list
2. Verify files are registered:
   - Open DevTools → Network tab
   - Search → Should show `POST /api/peers/announce`
   - Check response contains your files
3. Check search request:
   - Network tab → Look for `GET /api/peers/search?q=...`
   - Response should show peer data with matching files
4. Server logs should show:
   ```
   [Controller] Announced peer: <UUID> files: 2
   [Controller] Searching for: keyword
   [Controller] Search results for 'keyword': 1 peers found
   ```

### WebSocket Connection Errors

**Symptom:** `WebSocket connection to 'ws://localhost:9000/...' failed`

**Solution:**

- This is only for advanced setup with custom PeerJS server
- Default setup uses Render's PeerJS server (production) or built-in (local)
- Not needed for basic development

### MongoDB connection fails (optional)

**Default Behavior:** Server runs WITHOUT MongoDB in development

- Peer data stored in memory only
- Data resets when server restarts

**With MongoDB (Persistent):**

```bash
# 1. Start MongoDB
mongod

# 2. Verify connection
cd server
npm run dev
# Should print: [Server] MongoDB connected successfully

# 3. Data now persists across restarts
```

### 404 Errors on `/peer/*` endpoints

**Symptom:** `GET /peer/peerjs/id` returns 404

**Solutions:**

1. Ensure PeerJS server mounted correctly:
   - Server console should show: `[Server] 🔗 PeerJS server: /peer`
2. Frontend trying to connect to wrong host:
   - Check `REACT_APP_PEER_HOST` in `client/.env`
3. For production, verify:
   - Domain matches where app is hosted
   - HTTPS enabled
   - Render has `proxied: true` (already configured)

## Debugging

### Browser Console Logs

Press `F12` and filter for:

- `[PeerManager]` - WebRTC/peer connection issues
- `[App]` - Initialization and state changes
- `[SearchBar]` - Search functionality
- `[API]` - Backend HTTP requests/responses
- `[useHeartbeat]` - Keep-alive heartbeat pings

Example healthy startup:

```
[API] Initializing with base URL: http://localhost:5000/api
[App] Initializing PeerManager
[PeerManager] Initializing with config: Object
[PeerManager] Environment: development
[PeerManager] Origin: http://localhost:3000
[App] PeerManager instance created, calling init()
[PeerManager] Peer open: <UUID>
[App] Successfully initialized peer with ID: <UUID>
[useHeartbeat] Starting heartbeat every 10000 ms
[useHeartbeat] Heartbeat sent successfully
```

### Server Console Logs

Terminal where you ran `npm run dev`:

- `[Server]` - Startup and port info
- `[PeerServer]` - Peer connections/disconnections
- `[Controller]` - API request handling
- `[MongoDB]` - Database operations

Example healthy startup:

```
[Server] MongoDB connected successfully
[Server] ✅ Server listening on port 5000
[Server] 🔗 PeerJS server: /peer
[PeerServer] ✅ Peer connected: <UUID>
```

### Network Tab Debugging (F12 → Network)

Watch for these requests:

1. **POST /api/peers/announce** - Registers peer + files

   - Status: 200
   - Response: `{success: true, peer: {peerId, username}}`

2. **PUT /api/peers/heartbeat** - Keep-alive ping every 10s

   - Status: 200
   - Response: `{ok: true}`

3. **GET /api/peers/search?q=...** - Search files

   - Status: 200
   - Response: Array of peers with matching files

4. **WebSocket to /peer/peerjs** - Real-time peer signaling
   - Status: 101 Switching Protocols
   - Shows as `ws` or `wss` in Network tab

## Testing

```bash
# Run E2E test
cd client
npm test -- AppFlow.test.js

# Run all tests
npm test

# Run server tests (if added)
cd ../server
npm test
```

**What the E2E test checks:**

- PeerManager initialization
- React component rendering
- Context state updates
- API call mocking
- File upload/download flow

### Manual Testing Workflow

1. **Open App**

   ```bash
   npm run client  # Opens http://localhost:3000
   ```

2. **Upload Files**

   - Click "Share Files" section
   - Select 1-2 test files (any type)
   - Verify files appear in list

3. **Search in Same Client**

   - Type filename in search box
   - Should see results with your peer ID
   - Click "⬇️ Get" to initiate download

4. **Test with Multiple Clients**

   - Open second browser window: `http://localhost:3000`
   - First client uploads files, second client searches
   - Should find first client's files
   - Verify peer ID visible for both

5. **Test Persistence** (with MongoDB)
   - Restart server: Stop and `npm run dev`
   - Peers should re-announce via heartbeat
   - Files should be searchable if peer goes online

## API Endpoints

- `POST /api/peers/announce` - Register peer + files
- `GET /api/peers/search?q=term` - Search for files
- `PUT /api/peers/heartbeat` - Keep-alive ping

## File Structure

```
parker/
├── server/          # Express backend, PeerJS server, MongoDB models
├── client/          # React frontend, PeerJS client, WebRTC wrapper
├── README.md        # This file
└── .env files       # Configuration (already set up)
```
