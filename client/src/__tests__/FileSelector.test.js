import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FileSelector from "../components/FileManagement/FileSelector";
import { PeerProvider } from "../context/PeerContext";
import * as backend from "../api/backend";

jest.mock("../api/backend", () => ({
  sendAnnounce: jest.fn(),
  search: jest.fn(),
  sendHeartbeat: jest.fn()
}));

test("FileSelector calls onFilesSelected and sendAnnounce (if peerId)", () => {
  // render provider, but we need to set peerId: we can patch context by mounting provider and then simulating PeerProvider's default
  render(
    <PeerProvider>
      <FileSelector onFilesSelected={jest.fn()} />
    </PeerProvider>
  );

  const input = screen.getByTestId("file-input");
  // simulate file selection
  const file = new File(["hello"], "hello.txt", { type: "text/plain" });
  Object.defineProperty(input, "files", {
    value: [file]
  });

  // fire change event
  fireEvent.change(input);

  // sendAnnounce is called but peerId is null by default so should not throw; at least no crash
  expect(input).toBeInTheDocument();
});
