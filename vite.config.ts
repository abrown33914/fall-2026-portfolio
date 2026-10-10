import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Served from the root of a custom domain (allisonbrown.dev), so base stays '/'.
// If you ever deploy to https://<user>.github.io/<repo>/ without a domain, set base: '/<repo>/'.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
