// mock PeerManager factory
let mockInstance = null;

export default function PeerManager() {
  if (mockInstance) return mockInstance;
  
  mockInstance = {
    init: jest.fn(() => Promise.resolve("mock-peer-id")),
    connect: jest.fn(() => ({ on: jest.fn() })),
    getInstance: jest.fn(() => ({})),
  };
  
  return mockInstance;
}
