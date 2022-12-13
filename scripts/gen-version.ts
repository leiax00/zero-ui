import { writeFile } from 'node:fs/promises'
import * as path from 'node:path'
import consola from 'consola'
import pkg from '../packages/zero-ui/package.json' // need to be checked
import { pkgRoot } from './pkgRoot'

function getVersion() {
  const tagVer = process.env.TAG_VERSION
  if (tagVer) {
    return tagVer.startsWith('v') ? tagVer.slice(1) : tagVer
  } else {
    return pkg.version
  }
}

const version = getVersion()

async function main() {
  consola.info(`Version: ${version}`)
  await writeFile(
    path.resolve(pkgRoot, 'version.ts'),
    `export const version = '${version}'
export const name = '${pkg.name}'
`
  )
}

main()
