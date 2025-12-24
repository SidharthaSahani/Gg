import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  optimizeDeps: {
    // Only exclude if there are specific issues with lucide-react
    // exclude: ['lucide-react'],
  },
  server: {
    // Add host and port for better compatibility
    host: true,
    port: 3000,
    // Enable history API fallback for client-side routing
    strictPort: true,
    // Handle client-side routing
    // historyApiFallback: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  // History API fallback for SPA routing
  appType: 'spa'
});