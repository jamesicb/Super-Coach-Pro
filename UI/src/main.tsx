import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"

const rootEl = document.getElementById("root")!

try {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (e) {
  rootEl.innerHTML = `<div style="display:flex;min-height:100vh;align-items:center;justify-content:center;padding:2rem;font-family:sans-serif;"><div style="text-align:center;max-width:480px"><p style="font-size:1.1rem;font-weight:600;color:#ef4444">Failed to start app</p><pre style="margin-top:0.75rem;font-size:0.75rem;color:#666;white-space:pre-wrap">${e instanceof Error ? e.message : String(e)}</pre><button onclick="location.reload()" style="margin-top:1rem;padding:0.5rem 1rem;border-radius:6px;border:1px solid #ccc;cursor:pointer">Reload</button></div></div>`
}
