import { resolve, join } from 'path'
import { readdirSync } from 'fs'
import { listFiles } from './file'

const docPath = resolve(process.cwd(), 'docs')

function listDocDirDeep() {
  const doList = (path = '', depth = 0) => {
    const dirs = readdirSync(join(docPath, path), {
      withFileTypes: true
    }).filter(f => f.isDirectory()).filter(f => !/^\./.test(f.name)).map(f => ({
      name: f.name,
      path: join(path, f.name)
    }))
    dirs.forEach(subdir => {
      subdir.children = doList(subdir.path, depth + 1)
    })
    return dirs
  }
  return doList()
}

function listLeafDir(dirs) {
  const leafDirs = []
  const doList = (dirs) => {
    for (const dir of dirs) {
      const children = dir.children
      if (!children ||!children.length) {
        leafDirs.push(dir.path)
      } else {
        doList(children)
      }
    }
  }
  doList(dirs)
  return leafDirs
}

export function generateSidebar() {
  const dirs = listDocDirDeep()
  const leafDirs = listLeafDir(dirs)
  return leafDirs.reduce((conf, dir) => {
    const files =  listFiles(join(docPath, dir))
    conf[join('/', dir, '/')] = files.map(f => ([
      f.name,
      f.name
    ]))
    return conf
  }, {})
}
