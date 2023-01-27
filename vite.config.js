import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import FastGlob from 'fast-glob'
import { resolve } from 'path';

import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import';
import postcssNesting from 'postcss-nesting';
import postcssCustomMedia from 'postcss-custom-media';

const reload = {
    name: 'reload',
    handleHotUpdate({ file, server }) {
        if (!file.includes('temp') && file.endsWith(".php") || file.endsWith(".latte")) {
            server.ws.send({
                type: 'full-reload',
                path: '*',
            });
        }
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reload, react({fastRefresh: false})],
    worker: {
      plugins: [react()],
    },
    css: {
      postcss: {
          plugins: [postcssImport, postcssNesting, postcssCustomMedia, autoprefixer]
      }
    },
    server: {
      watch: {
          usePolling: true
      },
    hmr: {
          host: 'localhost:8091'
      }
    },
    build: {
      manifest: true,
        outDir: "www",
        emptyOutDir: false,
        rollupOptions: {
          input: FastGlob.sync(['./src/*.js', './src/*.less', './src/*.jsx']).map(entry => resolve(process.cwd(), entry))
      }
  }
})
