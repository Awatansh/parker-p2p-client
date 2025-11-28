import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchBar from "../components/Search/SearchBar";
import { PeerProvider } from "../context/PeerContext";
import * as backend from "../api/backend";

jest.mock("../api/backend", () => ({
  sendAnnounce: jest.fn(),
  search: jest.fn(),
  sendHeartbeat: jest.fn()
}));

test("SearchBar calls backend.search and updates context", async () => {
  backend.search.mockResolvedValueOnce({ data: [{ peerId: "p1", username: "u", files: [{ name: "x", size: 1 }] }] });

  render(
    <PeerProvider>
      <SearchBar />
    </PeerProvider>
  );

  const input = screen.getByTestId("search-input");
  fireEvent.change(input, { target: { value: "sta" } });

  await waitFor(() => {
    expect(backend.search).toHaveBeenCalledWith("sta");
  });
});
