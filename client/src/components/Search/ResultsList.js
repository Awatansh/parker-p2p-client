import React, { useContext } from "react";
import { PeerContext } from "../../context/PeerContext";
import PeerManager from "../../webrtc/PeerManager";

function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export default function ResultsList() {
  const { searchResults, setDownloads } = useContext(PeerContext);

  async function handleDownload(peerId, file) {
    try {
      const pm = PeerManager();
      const conn = pm.connect(peerId);

      // basic flow: request file by name, then handle incoming chunk events
      conn.on("open", () => {
        conn.send({ type: "request", name: file.name });
      });

      // local download stub: update downloads state
      setDownloads(d => [...d, { id: `${peerId}:${file.name}`, name: file.name, progress: 0, status: "pending" }]);
      // NOTE: full transfer handling (chunks -> blob -> save) would be implemented in a production app
    } catch (err) {
      console.error("download error", err);
    }
  }

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <div className="empty-state-text">No results found</div>
        <p style={{ fontSize: "12px" }}>Try searching for different keywords</p>
      </div>
    );
  }

  return (
    <div className="results-list">
      {searchResults.map((r) => (
        <div key={r.peerId} className="result-card">
          <div className="result-header">
            <div>
              <div className="result-peer-name">👤 {r.username}</div>
              <div className="result-peer-id" title={r.peerId}>Peer: {r.peerId.slice(0, 8)}...</div>
            </div>
            <div className="result-file-count">{r.files.length} file{r.files.length !== 1 ? "s" : ""}</div>
          </div>
          <div className="result-files">
            {r.files.map((f, idx) => (
              <div key={idx} className="result-file">
                <div style={{ flex: 1 }}>
                  <div className="result-file-name">📄 {f.name}</div>
                  <div className="result-file-size">{formatFileSize(f.size)}</div>
                </div>
                <button 
                  className="download-btn" 
                  onClick={() => handleDownload(r.peerId, f)}
                  style={{ 
                    width: "auto", 
                    marginTop: 0, 
                    padding: "6px 12px",
                    fontSize: "12px",
                    marginLeft: "8px"
                  }}
                >
                  ⬇️ Get
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
