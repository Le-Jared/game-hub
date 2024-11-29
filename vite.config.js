import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Remove the proxy configuration if you're not using it
  // Or keep it if you're running the backend server separately
})

