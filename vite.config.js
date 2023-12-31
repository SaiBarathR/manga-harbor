import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import reactRefresh from 'vite-plugin-react-refresh';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
    plugins: [react(), reactRefresh(), svgr(), eslint()],
    server: {
        host: true,
        strictPort: true,
        port: 3000
    },
    define: {
        global: 'window',
    },
    build: {
        outDir: "build"
    },
    base: '/',
})