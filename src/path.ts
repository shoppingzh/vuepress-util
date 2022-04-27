import path from 'path'

export function normalJoin(...paths: Array<string>): string {
  return path.join(...paths).replace(/\\+/g, '/')
}
