import React, { useContext } from "react";
import { render } from "@testing-library/react";
import { PeerProvider, PeerContext } from "../context/PeerContext";

function ReadPeer() {
  const ctx = useContext(PeerContext);
  return <div>peer:{String(ctx.peerId)}</div>;
}

test("PeerProvider provides default context", () => {
  const { getByText } = render(
    <PeerProvider>
      <ReadPeer />
    </PeerProvider>
  );
  expect(getByText("peer:null")).toBeInTheDocument();
});
