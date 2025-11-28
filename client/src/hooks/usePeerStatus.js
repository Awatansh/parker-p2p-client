import { useEffect, useState } from "react";

export default function usePeerStatus(peer) {
  const [online, setOnline] = useState(!!peer);

  useEffect(() => {
    if (!peer) {
      setOnline(false);
      return;
    }
    const onOpen = () => setOnline(true);
    const onClose = () => setOnline(false);

    peer.on("open", onOpen);
    peer.on("disconnected", onClose);
    peer.on("close", onClose);

    return () => {
      if (!peer) return;
      peer.off("open", onOpen);
      peer.off("disconnected", onClose);
      peer.off("close", onClose);
    };
  }, [peer]);

  return online;
}
