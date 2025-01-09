import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base:
    process.env.NODE_ENV === 'production'
      ? '/react-2024-week02-RESTful-API/'
      : '/',
  plugins: [react()],
});
