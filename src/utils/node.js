import { createRequire } from 'module'

export function require (url) {
  return createRequire(import.meta.url)(url)
}
