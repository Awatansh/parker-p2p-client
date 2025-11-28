import React from "react";
import { sendAnnounce } from "../../api/backend";
import { useContext } from "react";
import { PeerContext } from "../../context/PeerContext";

export default function FileSelector({ onFilesSelected }) {
  const { peerId, sharedFiles } = useContext(PeerContext);

  async function handleChange(e) {
    const files = Array.from(e.target.files || []).map(f => ({ name: f.name, size: f.size }));
    onFilesSelected(files);

    // announce to the backend
    if (peerId) {
      try {
        await sendAnnounce({ peerId, username: "web-client", files });
      } catch (err) {
        console.warn("announce fail", err);
      }
    }
  }

  return (
    <div className="file-selector">
      <div className="file-input-wrapper">
        <input 
          data-testid="file-input" 
          type="file" 
          multiple 
          onChange={handleChange}
          id="file-input"
        />
        <label htmlFor="file-input" className="file-input-label">
          <span>📤</span>
          <span>Click or drag files to share</span>
        </label>
      </div>
      <div className="sharing-status">
        ✨ Sharing <strong>{sharedFiles.length}</strong> {sharedFiles.length === 1 ? "file" : "files"}
      </div>
    </div>
  );
}
