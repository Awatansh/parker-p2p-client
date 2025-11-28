import React from "react";

function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function getFileExtension(filename) {
  return filename.split(".").pop().toUpperCase().slice(0, 3) || "FILE";
}

export default function FileList({ files = [] }) {
  if (!files.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📂</div>
        <div className="empty-state-text">No files shared yet</div>
        <p style={{ fontSize: "12px" }}>Select files above to start sharing</p>
      </div>
    );
  }

  return (
    <div className="file-list">
      {files.map((f, idx) => (
        <div key={idx} className="file-item">
          <div className="file-icon">
            {getFileExtension(f.name)}
          </div>
          <div className="file-info">
            <div className="file-name" title={f.name}>{f.name}</div>
            <div className="file-size">{formatFileSize(f.size)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
