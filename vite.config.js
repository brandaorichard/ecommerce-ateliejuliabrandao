import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        lexend: ['"Lexend"', 'sans-serif'],
      },
      colors: {
        rosaClaro: '#f9e7f6',
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ['react-is']
  },
  build: {
    commonjsOptions: {
      include: [/react-is/, /node_modules/]
    }
  }
})
