import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// 递归内联本地 @import，产出单文件 CSS
function inlineImports(css, baseDir) {
  return css.replace(/@import\s+['"]([^'"]+)['"];?/g, (_m, dep) => {
    const depPath = resolve(baseDir, dep)
    const depCss = readFileSync(depPath, 'utf8')
    return inlineImports(depCss, dirname(depPath))
  })
}

const src = readFileSync(resolve(root, 'src/index.css'), 'utf8')
const bundled = inlineImports(src, resolve(root, 'src'))
mkdirSync(resolve(root, 'dist'), { recursive: true })
writeFileSync(resolve(root, 'dist/index.css'), bundled)
console.log('theme: wrote dist/index.css (' + bundled.length + ' bytes)')
