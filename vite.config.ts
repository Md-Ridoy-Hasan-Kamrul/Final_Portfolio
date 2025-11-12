import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Babel configuration for optimizations
      babel: {
        plugins: [
          // Add any babel plugins here if needed
        ],
      },
    }),
  ],

  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom'],
  },

  // Build configuration for production
  build: {
    // Output directory
    outDir: 'dist',

    // Generate sourcemaps for debugging (disable in production)
    sourcemap: false,

    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },

    // Chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,

    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['framer-motion', '@react-spring/web'],
          'i18n-vendor': ['i18next', 'react-i18next'],
          'icons-vendor': ['lucide-react'],
        },

        // Asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff|woff2/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },

        // Chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',

        // Entry file names
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // Target browsers
    target: 'esnext',

    // CSS code splitting
    cssCodeSplit: true,
  },

  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
  },

  // Development server configuration
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: true,
  },
});
