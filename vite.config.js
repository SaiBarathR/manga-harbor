import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import reactRefresh from 'vite-plugin-react-refresh';

export default defineConfig({
    plugins: [react(), reactRefresh(), svgr()],
    server: {
        host: true,
        strictPort: true,
        port: 4000
    },
    define: {
        global: 'window',
    },
    build: {
        outDir: "mh"
    },
    base: './'
})