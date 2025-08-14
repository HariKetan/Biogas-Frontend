import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Include emotion support
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@lib': resolve(__dirname, './src/lib'),
      '@theme': resolve(__dirname, './src/theme'),
      '@layouts': resolve(__dirname, './src/layouts'),
      '@sections': resolve(__dirname, './src/sections'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  server: {
    port: 3000,
    open: false,
    host: true,
    cors: true,
    // Proxy API calls if needed
    proxy: {
      '/api': {
        target: 'http://172.105.33.238:3500',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Optimize build
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          charts: ['apexcharts', 'react-apexcharts'],
        },
      },
    },
    // Build performance optimizations
    chunkSizeWarningLimit: 1000,
  },
  define: {
    global: 'globalThis',
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
    // Remove console.log in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
    include: ['react', 'react-dom', '@emotion/react', '@emotion/styled', '@mui/material', 'axios'],
    exclude: ['@faker-js/faker'],
  },
  // Performance optimizations
  css: {
    devSourcemap: true,
  },
});
