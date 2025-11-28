// src/__mocks__/axios.js
// Provide a mock that behaves like axios including axios.create()
const axiosMock = {
  // axios.create() should return an axios-like instance (we return the same mock)
  create: jest.fn(() => axiosMock),

  // common methods used in the client tests
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),

  // allow reading/writing defaults if code touches them
  defaults: {},
  // allow interceptors stub if something accesses them
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  }
};

export default axiosMock;
