import React, { useEffect, useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResultsList from "../components/Search/ResultsList";
import { PeerProvider, PeerContext } from "../context/PeerContext";

jest.mock("../webrtc/PeerManager", () => () => ({
  connect: jest.fn(() => ({ on: jest.fn(), send: jest.fn() }))
}));

const mockResults = [
  {
    peerId: "peerA",
    username: "Alice",
    files: [{ name: "Matrix.mp4", size: 200 }]
  }
];

function Wrapper() {
  const ctx = useContext(PeerContext);

  useEffect(() => {
    ctx.setSearchResults(mockResults);
  }, []);

  return <ResultsList />;
}

test("ResultsList lists files and download button", () => {
  render(
    <PeerProvider>
      <Wrapper />
    </PeerProvider>
  );

  // flexible matcher: looks for substring anywhere in the element text
  expect(screen.getByText((content) => content.includes("Matrix.mp4"))).toBeInTheDocument();

  const downloadBtn = screen.getByText("Download");
  fireEvent.click(downloadBtn); // should not crash
});
