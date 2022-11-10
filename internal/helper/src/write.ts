import { resolve } from 'path'
import { mkdir, writeFileSync } from 'fs'
import type { Options, Props, Tags, WebTypes } from './type'

export function write(
  options: Options,
  type: 'tags' | 'attributes' | 'webTypes',
  data: Tags | Props | WebTypes
): void {
  const path = resolve(options.outDir, options[type])
  const buffer = JSON.stringify(data, null, options.space)

  writeFileRecursive(path, buffer)
}

function writeFileRecursive(path: string, buffer: string) {
  const lastPath = path.slice(0, Math.max(0, path.lastIndexOf('/')))

  mkdir(lastPath, { recursive: true }, () => {
    writeFileSync(path, buffer)
  })
}
