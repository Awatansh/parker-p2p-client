import React, { createContext, useState } from "react";

export const PeerContext = createContext();

export function PeerProvider({ children }) {
  const [peerId, setPeerId] = useState(null);
  const [sharedFiles, setSharedFiles] = useState([]); // [{name,size}]
  const [downloads, setDownloads] = useState([]); // [{id, name, progress}]
  const [searchResults, setSearchResults] = useState([]); // results from backend

  return (
    <PeerContext.Provider value={{
      peerId, setPeerId,
      sharedFiles, setSharedFiles,
      downloads, setDownloads,
      searchResults, setSearchResults
    }}>
      {children}
    </PeerContext.Provider>
  );
}
