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
    // Code splitting manual para melhor cache
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks principais
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          // UI libraries
          'ui-motion': ['framer-motion', 'react-swipeable'],
          'ui-icons': ['react-icons', 'lucide-react'],
          // Analytics e third-party
          'analytics': ['react-ga4'],
          // Utilitários
          'utils': ['axios', 'clsx', 'uuid']
        },
        // Nomes consistentes para melhor cache
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Minificação agressiva
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remover console.log em produção
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        // Otimizações adicionais
        passes: 2
      },
      format: {
        // Remover comentários
        comments: false
      }
    },
    // Melhorar sourcemaps (opcional, pode desabilitar em prod)
    sourcemap: false,
    // Aumentar limite de warning para chunks grandes
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      include: [/react-is/, /node_modules/]
    }
  }
})
