import { join, resolve } from 'path'
// 临时使用该方式引入版本
import { name, version } from '../../../packages/zero-ui/package.json'
import main from '@/index'

const rootDir = resolve(__dirname, '../../../')

main({
  name,
  version,
  outDir: join(rootDir, 'packages/zero-ui/dist'),
  entry: 'docs/**/*.md',
  space: 2,
  fastGlobConfig: {
    cwd: rootDir,
    ignore: ['**/node_modules', '**/dist'],
  },
  reComponentName,
  reWebTypesSource,
  reDocUrl,
  reAttribute,
})

function reComponentName(title: string) {
  return `sz-${title
    .replace(/\B([A-Z])/g, '-$1')
    .replace(/[ ]+/g, '-')
    .toLowerCase()}`
}

function reWebTypesSource(title: string) {
  const symbol = `Sz${title
    .replace(/-/, ' ')
    .replace(/^\w|\s+\w/g, (item) => item.trim().toUpperCase())}`

  return { symbol }
}

function reDocUrl(fileName: string, header?: string) {
  const docs = 'https://you.components/docs/'
  const _header = header ? header.replace(/[ ]+/g, '-') : undefined
  return docs + fileName + (_header ? `#${_header}` : '')
}

function reAttribute(str: string, key: string) {
  switch (str) {
    case '':
    case '-':
    case '—':
      return undefined
    case 'v-model':
      return 'model-value'
    default:
      if (key === 'Subtags') {
        return str
          ? str
              .split('/')
              .map((name) => reComponentName(name.trim()))
              .join('/')
          : str
      } else {
        return str
      }
  }
}
