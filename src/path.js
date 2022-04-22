import path from 'path'

export function normalJoin(...paths) {
  return path.join(...paths).replace(/\\+/g, '/')
}
