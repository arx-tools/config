import type { XoConfigItem } from 'xo'
import { createXoConfig } from './src/xo.ts'

// the annotation keeps the type portability: without it the inferred type points into the
// `node_modules` of the package, which typescript does not accept
const xoConfig: XoConfigItem[] = createXoConfig()

export default xoConfig
