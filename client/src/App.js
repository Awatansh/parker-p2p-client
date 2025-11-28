import React, { useContext, useEffect } from "react";
import Header from "./components/Layout/Header";
import FileSelector from "./components/FileManagement/FileSelector";
import FileList from "./components/FileManagement/FileList";
import SearchBar from "./components/Search/SearchBar";
import ResultsList from "./components/Search/ResultsList";
import DownloadManager from "./components/Transfer/DownloadManager";
import { PeerContext } from "./context/PeerContext";
import PeerManager from "./webrtc/PeerManager";
import useHeartbeat from "./hooks/useHeartbeat";
import { sendAnnounce } from "./api/backend";

import "./styles.css"; // optional, create as needed

export default function App() {
  const { peerId, setPeerId, sharedFiles, setSharedFiles } = useContext(PeerContext);

  useEffect(() => {
    // initialize PeerManager
    console.log("[App] Initializing PeerManager");
    const pm = PeerManager();
    if (pm && pm.init) {
      console.log("[App] PeerManager instance created, calling init()");
      pm.init().then(id => {
        console.log("[App] Successfully initialized peer with ID:", id);
        setPeerId(id);
        
        // Announce peer immediately with empty files
        console.log("[App] Announcing peer to backend immediately");
        sendAnnounce({ 
          peerId: id, 
          username: "web-client", 
          files: [] 
        }).catch(err => {
          console.warn("[App] Initial announce failed:", err.message);
        });
      }).catch(err => {
        console.error("[App] Failed to initialize PeerManager:", err);
      });
    } else {
      console.error("[App] PeerManager instance or init method is invalid:", pm);
    }
  }, [setPeerId]);

  // start heartbeat when we have a peerId
  useHeartbeat(peerId);

  return (
    <div className="app-container">
      <Header />
      <section>
        <h3>📁 Share Files</h3>
        <FileSelector onFilesSelected={(files) => setSharedFiles(files)} />
        <FileList files={sharedFiles} />
      </section>

      <section>
        <h3>🔍 Search</h3>
        <SearchBar />
        <ResultsList />
      </section>

      <section>
        <h3>⬇️ Downloads</h3>
        <DownloadManager />
      </section>
    </div>
  );
}
