import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // On GitHub Pages the site lives at https://kayziia.github.io/stitch-ui-test/
  base: command === 'build' ? '/stitch-ui-test/' : '/',
  server: { host: true, port: 5173, allowedHosts: true },
}))
