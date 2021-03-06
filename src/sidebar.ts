import { resolve, join } from 'path'
import { normalJoin } from './path'
import { readdirSync, readFileSync } from 'fs'
import { getExtension, getBasename, listFilesByOrder } from './file'

const docPath = resolve(process.cwd(), 'docs')

/**
 * 生成sidebar配置
 */
export function generateSidebar() {
  /**
   * 1. 递归读取docs目录下的次级目录
   * 2. 如果目录下没有文档，则不生成侧边栏
   * 3. 如果目录下有文档，则根据是否有.order文件来决定其顺序
   */
  const conf = {}
  const doDeepList = (path = '') => {
    const dirs = readdirSync(join(docPath, path), { withFileTypes: true })
      .filter(o => o.isDirectory()) // 目录
      .filter(f => !/^\./.test(f.name)) // 非以.开头的目录
    dirs.forEach(dir => {
      const dirPath = join(path, dir.name)
      const docFiles = listFilesByOrder(join(docPath, dirPath), f => /md/i.test(getExtension(f.name)))
      if (docFiles.length) {
        // 解决Windows下join为\\的问题
        const path = normalJoin('/', dirPath, '/')
        conf[path] = docFiles.map(f => ([
          getBasename(f.name),
          f.name
        ]))
      }
      doDeepList(join(path, dir.name))
    })
  }
  doDeepList()
  return conf
}
