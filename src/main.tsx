
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Useful for debugging
window.addEventListener('supabase.auth.session', (e) => {
  console.log('Auth session changed:', (e as CustomEvent).detail);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
