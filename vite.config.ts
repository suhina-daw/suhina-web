import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  build: {
    rolldownOptions: {
      input: Object.fromEntries(['index.html', 'guide/index.html', 'settings/index.html', 'shortcuts/index.html']
        .map(path => [path, fileURLToPath(new URL(path, import.meta.url))])),
    },
  },
})
