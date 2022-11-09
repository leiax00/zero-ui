import { defineConfig } from 'vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue(), DefineOptions()],
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: false, // 端口占用是否进行下一个端口尝试
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {},
  },
})
