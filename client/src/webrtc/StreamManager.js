// basic sender-side chunking (browser File -> arrayBuffer chunks)
export async function streamFile(conn, file, onProgress = () => {}) {
  // send file metadata first
  conn.send({ type: "meta", name: file.name, size: file.size });

  const chunkSize = 64 * 1024; // 64KB
  const reader = file.stream().getReader();
  let done = false;
  let sent = 0;

  while (!done) {
    const { value, done: finished } = await reader.read();
    if (value) {
      conn.send({ type: "chunk", data: value });
      sent += value.byteLength;
      onProgress(sent / file.size);
    }
    done = finished;
  }
  conn.send({ type: "end" });
}
