import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Importe isso

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Adicione isso aqui
  ],
})