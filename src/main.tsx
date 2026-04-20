import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Ask the browser to keep IndexedDB persistent (avoid eviction under
// storage pressure). Most browsers grant this silently for installed
// or bookmarked sites.
if (navigator.storage?.persist) {
  navigator.storage.persist().catch(() => {
    // non-fatal; worst case browser may evict data if space runs out
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
