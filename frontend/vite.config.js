import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // force external binding
    port: 5173,
    strictPort: true,
    allowedHosts: [
      '.ngrok-free.dev'   // allow ALL ngrok subdomains
    ]
  }
})