import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

//This is where I can add plugins
export default defineConfig({
  plugins: [react()],
})
