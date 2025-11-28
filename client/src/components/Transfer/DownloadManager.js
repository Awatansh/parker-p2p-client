import React, { useContext } from "react";
import { PeerContext } from "../../context/PeerContext";

function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function getStatusBadge(status = "pending") {
  const statusMap = {
    pending: "status-pending",
    downloading: "status-downloading",
    completed: "status-completed"
  };
  const textMap = {
    pending: "Pending",
    downloading: "Downloading",
    completed: "Completed"
  };
  return (
    <span className={`download-status ${statusMap[status] || statusMap.pending}`}>
      {textMap[status] || "Pending"}
    </span>
  );
}

export default function DownloadManager() {
  const { downloads } = useContext(PeerContext);

  if (!downloads.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📥</div>
        <div className="empty-state-text">No active downloads</div>
        <p style={{ fontSize: "12px" }}>Downloaded files will appear here</p>
      </div>
    );
  }

  return (
    <div className="downloads-list">
      {downloads.map(d => (
        <div key={d.id} className="download-item">
          <div className="download-item-header">
            <div className="download-name">{d.name}</div>
            {getStatusBadge(d.status)}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.round((d.progress || 0) * 100)}%` }}
            ></div>
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
            {Math.round((d.progress || 0) * 100)}% • {formatFileSize(d.size || 0)}
          </div>
        </div>
      ))}
    </div>
  );
}
