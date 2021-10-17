import path from 'path'

export function normalJoin(...paths) {
  path.join(paths).replace(/\\+/g, '/')
}
