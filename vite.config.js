import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/

//This is where I can add plugins
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
