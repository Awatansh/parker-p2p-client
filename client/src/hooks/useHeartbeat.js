import { useEffect, useRef } from "react";
import { sendHeartbeat } from "../api/backend";

export default function useHeartbeat(peerId) {
  const intervalRef = useRef(null);
  useEffect(() => {
    if (!peerId) {
      console.log("[useHeartbeat] No peerId, skipping heartbeat");
      return;
    }
    const intervalMs = Number(process.env.REACT_APP_HEARTBEAT_INTERVAL_MS) || 10000;
    console.log("[useHeartbeat] Starting heartbeat every", intervalMs, "ms for peer:", peerId);

    const tick = () => {
      sendHeartbeat(peerId)
        .then(() => {
          console.log("[useHeartbeat] Heartbeat sent successfully for:", peerId);
        })
        .catch(err => {
          console.error("[useHeartbeat] Heartbeat failed:", err.message);
          if (err.response?.status === 404) {
            console.warn("[useHeartbeat] Peer not found on server, peer might have expired");
          }
        });
    };

    // send immediately and then every interval
    tick();
    intervalRef.current = setInterval(tick, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log("[useHeartbeat] Heartbeat stopped for peer:", peerId);
      }
    };
  }, [peerId]);
}
