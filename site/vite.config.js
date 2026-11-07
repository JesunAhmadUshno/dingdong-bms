import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// src/facts.check.mjs reads ../web and the repo docs, asserts known answers and writes src/facts.json.
// The page imports only that JSON, so no seed password or SIN-format string reaches the bundle.
export default defineConfig({
  base: '/dingdong-bms/',
  plugins: [react()],
});
