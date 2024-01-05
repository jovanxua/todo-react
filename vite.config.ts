import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxImportSource: "@emotion/react",
    babel: {
      plugins: ["@emotion/babel-plugin"],
    },
  })],
  test: {
    // Options for vitest
    globals: true,
    environment: 'jsdom',
  },
  define: {
    'process.env': {}
  },
});
