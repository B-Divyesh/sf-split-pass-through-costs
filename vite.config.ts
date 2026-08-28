import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: { main: resolve(__dirname, 'index.html'), demo: resolve(__dirname, 'demo/index.html') },
      output: {
        entryFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => assetInfo.names.some((name) => name.endsWith('.css')) ? 'assets/app.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
  server: { host: '127.0.0.1' },
});
