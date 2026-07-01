import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Screenshots / Playwright artefacts written during verification must not
    // trigger HMR reloads.
    watch: { ignored: ['**/*.png', '**/.playwright-mcp/**'] },
  },
})
