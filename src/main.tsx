import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import TanstackProvider from "./api/TanstackProvider";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TanstackProvider>
      <App />
      <Toaster />
    </TanstackProvider>
  </React.StrictMode>,
);
