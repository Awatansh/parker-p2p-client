import PeerManager from "../webrtc/PeerManager";

jest.mock("peerjs", () => {
  return function MockPeer() {
    setTimeout(() => this.onopen("mock-peer"), 10);
    return {
      on: jest.fn((event, fn) => {
        if (event === "open") {
          setTimeout(() => fn("mock-peer"), 0);
        }
      }),
      connect: jest.fn(() => ({
        on: jest.fn(),
        send: jest.fn()
      }))
    };
  };
});

test("PeerManager initializes and returns a peerId", async () => {
  const pm = PeerManager();
  const id = await pm.init();
  expect(id).toBe("mock-peer");
});
