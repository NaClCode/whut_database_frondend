import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';
import alias from '@rollup/plugin-alias';
import path from 'path';
export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          title: 'react-app',
        },
      },
    }),
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
      ],
    }),
  ],
  server: {
    port: 3000, 
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      output: {
      },
    },
  },
});
