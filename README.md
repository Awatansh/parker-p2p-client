# Parker (P2P File Sharing - Napster Clone)

A decentralized peer-to-peer file sharing application using WebRTC (PeerJS) for data transfer and Express.js backend for peer discovery and file indexing.

## Quick Start

### Prerequisites

- Node.js v16+
- MongoDB (optional for dev, will run in-memory mode without it)

### Installation & Run

```bash
# Terminal 1: Start Backend Server
cd server
npm install
npm run dev
# Should print: [Server] Listening on http://localhost:5000

# Terminal 2: Start Frontend
cd client
npm install
npm start
# Opens http://localhost:3000
```

## Architecture

**Control Plane (Centralized):**

- Backend (Express): Peer discovery, file indexing, search
- Database (MongoDB): Peer metadata with TTL expiration
- PeerJS Server: WebRTC signaling

**Data Plane (Decentralized):**

- Direct peer-to-peer WebRTC connections
- Encrypted file transfer via data channels

## Troubleshooting

### PeerID: not connected

- Ensure backend is running: `npm run dev` in `server/`
- Check `REACT_APP_PEER_SERVER=http://localhost:5000/peer` in `client/.env`
- Check browser console for `[PeerManager]` logs

### Search not working

- Check backend is accessible: `[API]` logs should show requests
- Upload files first via "Share files" section
- Click "Go Online" to register
- Search logs will show in `[SearchBar]` and `[API]` prefixes

### MongoDB connection fails (optional)

- Server runs in-memory mode without MongoDB
- Data resets on server restart
- To use persistent storage, start MongoDB: `mongod`

## Debugging

Check browser console (F12) for logs:

- `[PeerManager]` - WebRTC issues
- `[App]` - App initialization
- `[SearchBar]` - Search functionality
- `[API]` - Backend API calls

Check server console:

- `[Server]` - Startup info
- `[MongoDB]` - Database status

## Testing

```bash
# Run E2E test
cd client
npm test -- AppFlow.test.js
```

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
