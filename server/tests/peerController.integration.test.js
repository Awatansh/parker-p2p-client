// server/tests/peerController.integration.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const connectDB = require("../config/db");
const Peer = require("../models/Peer");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connectDB(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

afterEach(async () => {
  await Peer.deleteMany({});
});

describe("peer endpoints", () => {
  test("announce registers peer and files", async () => {
    const payload = {
      peerId: "peer-1",
      username: "alice",
      files: [{ name: "StarWars_1977.mp4", size: 12345 }]
    };
    const res = await request(app).post("/api/peers/announce").send(payload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const doc = await Peer.findOne({ peerId: "peer-1" });
    expect(doc).not.toBeNull();
    expect(doc.files.length).toBe(1);
    expect(doc.files[0].name).toBe("StarWars_1977.mp4"); // sanitized -> depends on sanitize rules
  });

  test("search finds peer by prefix token", async () => {
    // announce
    await request(app).post("/api/peers/announce").send({
      peerId: "peer-2",
      username: "bob",
      files: [{ name: "Stark_Industries_Report.pdf", size: 100 }]
    });

    // search using a prefix token, e.g. 'sta' or 'stark' depending on MIN_PREFIX_LENGTH
    const searchToken = "sta";
    const res = await request(app).get("/api/peers/search").query({ q: searchToken });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty("peerId", "peer-2");
    expect(res.body[0].files.length).toBeGreaterThanOrEqual(1);
  });

  test("heartbeat updates lastHeartbeat", async () => {
    await request(app).post("/api/peers/announce").send({
      peerId: "peer-3",
      username: "charlie",
      files: [{ name: "foo.mp3", size: 200 }]
    });

    const before = await Peer.findOne({ peerId: "peer-3" });
    const oldTs = before.lastHeartbeat;

    const res = await request(app).put("/api/peers/heartbeat").send({ peerId: "peer-3" });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const after = await Peer.findOne({ peerId: "peer-3" });
    expect(after.lastHeartbeat.getTime()).toBeGreaterThanOrEqual(oldTs.getTime());
  });
});
