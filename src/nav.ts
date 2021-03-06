import { resolve, join } from 'path'
import { normalJoin } from './path'
import { listFiles, getBasename, getExtension, isFile } from './file'

const docPath = resolve(process.cwd(), 'docs')

interface NavConfig {
  text?: string,
  link?: string,
  items?: NavConfig[]
}

/**
 * 自动生成导航栏
 * @param {Array} navs 导航栏配置
 */
export function generateNav(navs) {
  const doGenerateNav = (navItem, path = '', depth = 0) => {
    const conf: NavConfig = {}
    conf.text = navItem.name
    const children = navItem.children
    if (children && children.length) {
      conf.items = children.map(childItem => doGenerateNav(childItem, join(path, childItem.path), depth + 1))
    } else {
      const filePath = join(docPath, path)
      if (isFile(filePath)) {
        conf.link = normalJoin('/', path)
      } else {
        const files = listFiles(filePath, f => /^md$/i.test(getExtension(f.name)))
        if (!files || !files.length) return conf
        if (!navItem.docs) {
          conf.link = normalJoin('/', path, files[0].name)
        } else {
          conf.items = files.map(f => ({
            text: getBasename(f.name),
            link: normalJoin('/', path, f.name)
          }))
        }
      }
    }
    return conf
  }
  return navs.map(item => {
    return doGenerateNav(item, item.path)
  })
}
