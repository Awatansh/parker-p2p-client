import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { PeerProvider } from "../context/PeerContext";
import * as backendAPI from "../api/backend";
import PeerManager from "../webrtc/PeerManager";

// Mock the modules
jest.mock("../api/backend");
jest.mock("../webrtc/PeerManager");

describe("App Flow", () => {
  beforeEach(() => {
    // Setup PeerManager mock
    PeerManager.mockReturnValue({
      init: jest.fn().mockResolvedValue("mock-peer-id"),
      connect: jest.fn().mockReturnValue({ on: jest.fn() }),
      getInstance: jest.fn().mockReturnValue({}),
    });

    // Setup backend API mocks
    backendAPI.search.mockResolvedValue({
      data: [
        {
          peerId: "peerZ",
          username: "Zed",
          files: [{ name: "File.mp4", size: 200 }]
        }
      ]
    });
    backendAPI.sendHeartbeat.mockResolvedValue({});
    backendAPI.sendAnnounce.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("full flow: search loads and renders results", async () => {
    render(
      <PeerProvider>
        <App />
      </PeerProvider>
    );

    const input = screen.getByPlaceholderText("Search files or keywords...");
    fireEvent.change(input, { target: { value: "sta" } });

    // Wait for debounce and search to complete
    await waitFor(() => {
      expect(backendAPI.search).toHaveBeenCalledWith("sta");
    }, { timeout: 2000 });

    // Wait for the search results to render
    await waitFor(() => {
      expect(screen.getByText(/File\.mp4/)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
