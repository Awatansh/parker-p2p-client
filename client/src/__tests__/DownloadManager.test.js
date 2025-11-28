import React from "react";
import { render, screen } from "@testing-library/react";
import DownloadManager from "../components/Transfer/DownloadManager";
import { PeerProvider, PeerContext } from "../context/PeerContext";

test("DownloadManager shows downloads", () => {
  render(
    <PeerProvider>
      <PeerContext.Consumer>
        {ctx => {
          ctx.downloads = [{ id: "1", name: "fileA.mp4", progress: 0.5 }];
          return <DownloadManager />;
        }}
      </PeerContext.Consumer>
    </PeerProvider>
  );

  expect(screen.getByText("fileA.mp4")).toBeInTheDocument();
});
