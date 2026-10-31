import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative asset paths let the built site work under any GitHub Pages repo path.
  base: './',
  plugins: [react(), tailwindcss()],
});
