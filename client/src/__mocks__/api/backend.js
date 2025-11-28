export const search = jest.fn(() =>
  Promise.resolve({
    data: [
      {
        peerId: "peerZ",
        username: "Zed",
        files: [{ name: "File.mp4", size: 200 }]
      }
    ]
  })
);

export const sendHeartbeat = jest.fn(() => Promise.resolve({}));
export const sendAnnounce = jest.fn(() => Promise.resolve({}));
