import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import dts from 'vite-plugin-dts'
import DefineOptions from 'unplugin-vue-define-options/vite'

const pkgName = 'zero-ui'
const resolve = (url: string) => {
  return path.resolve(__dirname, '../../', url)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    DefineOptions(),
    dts({
      root: resolve(''),
      //指定使用的tsconfig.json为我们整个项目根目录下掉,如果不配置,你也可以在components下新建tsconfig.json
      tsConfigFilePath: resolve('tsconfig.json'),
      outputDir: [resolve('dist'), resolve('dist/lib')],
      cleanVueFileName: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    target: 'modules',
    //打包文件目录
    outDir: 'dist',
    //压缩
    minify: false,
    //css分离
    //cssCodeSplit: true,
    lib: {
      entry: 'index.ts',
      name: pkgName,
      formats: ['es', 'cjs'],
      // fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      input: 'index.ts',
      output: [
        {
          format: 'es',
          exports: 'named',
          //不用打包成.es.js,这里我们想把它打包成.js
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          //配置打包根目录
          dir: resolve('dist/es'),
          preserveModulesRoot: resolve('packages/zero-ui'),
        },
        {
          format: 'cjs',
          exports: 'named',
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          //配置打包根目录
          dir: resolve('dist/lib'),
          preserveModulesRoot: resolve('packages/zero-ui'),
        },
      ],
    },
  },
})
