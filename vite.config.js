import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// See https://vitejs.dev/config/ for full configuration options.
// This configuration uses the React plugin to transform JSX and enable fast refresh
export default defineConfig({
  plugins: [react()],
  build: {
    // produce a single output directory under dist
    outDir: 'dist'
  }
});