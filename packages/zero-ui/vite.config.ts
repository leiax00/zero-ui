import * as path from 'path'
import * as fs from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import dts from 'vite-plugin-dts'
import DefineOptions from 'unplugin-vue-define-options/vite'

const resolve = (...uri: string[]) => {
  return path.resolve(__dirname, ...uri)
}
const join = (...uri: string[]) => {
  return path.join(...uri)
}

const pkgName = 'zero-ui'
const outputDir = 'dist'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), DefineOptions(), dts(generateDtsOpts())],
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@leiax00': resolve('../'),
    },
  },
  build: {
    target: 'modules',
    //打包文件目录
    outDir: resolve(outputDir),
    //压缩
    minify: false,
    //css分离
    //cssCodeSplit: true,
    lib: {
      entry: resolve('index.ts'),
      name: pkgName,
      formats: ['es', 'cjs', 'umd'],
      // fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      input: resolve('index.ts'),
      output: [
        {
          format: 'es',
          exports: 'auto',
          globals: { vue: 'Vue' },
          //配置打包根目录
          dir: resolve(outputDir, 'es'),
          //让打包目录和我们目录对应
          preserveModules: true,
          preserveModulesRoot: resolve(),
          //不用打包成.es.js,这里我们想把它打包成.js
          entryFileNames: '[name].mjs',
        },
        {
          format: 'cjs',
          exports: 'named',
          globals: { vue: 'Vue' },
          //配置打包根目录
          dir: resolve(outputDir, 'lib'),
          //让打包目录和我们目录对应
          preserveModules: true,
          preserveModulesRoot: resolve(),
          entryFileNames: '[name].js',
        },
        {
          format: 'umd',
          exports: 'named',
          globals: { vue: 'Vue' },
          //配置打包根目录
          dir: resolve(outputDir, 'umd'),
          entryFileNames: '[name].js',
        },
      ],
    },
  },
})

function generateDtsOpts() {
  const outDir = resolve(outputDir)
  function mergeDts() {
    travel(join(outDir, 'packages'), (filePath: string) => {
      const fileName = path.basename(filePath)
      // module root拷贝根目录, 其他都是原目录拷贝
      if (filePath.startsWith(join(outDir, 'packages', pkgName))) {
        fs.copyFileSync(filePath, join(outDir, 'es', fileName))
        fs.copyFileSync(filePath, join(outDir, 'lib', fileName))
      } else {
        fs.copyFileSync(
          filePath,
          filePath.replace(join(outDir, 'packages'), join(outDir, 'es'))
        )
        fs.copyFileSync(
          filePath,
          filePath.replace(join(outDir, 'packages'), join(outDir, 'lib'))
        )
      }
    })
    //  清理拷贝后的文件
    delDir(join(outDir, 'packages'))
    delDir(join(outDir, 'typings'))
  }
  return {
    root: resolve('../../'),
    tsConfigFilePath: resolve('../../tsconfig.json'),
    outputDir: [join(outDir, 'es'), join(outDir, 'cjs')],
    entryRoot: resolve(),
    // cleanVueFileName: true,
    // afterBuild: mergeDts,
  }
}

function travel(dir: string, callback: any) {
  fs.readdirSync(dir).forEach((file) => {
    const pathname = path.join(dir, file)
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback)
    } else {
      callback(pathname)
    }
  })
}

function delDir(path: string) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach((file, index) => {
      const curPath = `${path}/${file}`
      //判断是否是文件夹
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath) //递归删除文件夹
      } else {
        //是文件的话说明是最后一层不需要递归
        fs.existsSync(curPath) && fs.unlinkSync(curPath) //删除文件
      }
    })
    fs.rmdirSync(path)
  }
}
