import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PeerProvider } from "./context/PeerContext";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <PeerProvider>
    <App />
  </PeerProvider>
);
