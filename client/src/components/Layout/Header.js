import React, { useContext } from "react";
import { PeerContext } from "../../context/PeerContext";

export default function Header() {
  const { peerId } = useContext(PeerContext);
  
  return (
    <header>
      <h1>🚀 Parker</h1>
      <div className="peer-info">
        <div className="peer-status"></div>
        <span>
          <strong>Peer ID:</strong> {peerId ? peerId.slice(0, 8) + "..." : "Connecting..."}
        </span>
      </div>
    </header>
  );
}
