import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

/**
 * 查找目录下的所有文件
 * @param {String} dir 目录
 * @param {Function} filters 过滤规则
 */
export function listFiles(dir, ...filters) {
  let files = readdirSync(dir, {
    withFileTypes: true
  }).filter(f => f.isFile())
  if (filters && filters.length) {
    for (let filter of filters) {
      files = files.filter(filter)
    }
  }
  return files.map(f => ({
    name: f.name,
    dirent: f,
    path: `${dir}/${f.name}`
  }))
}

/**
 * 判断路径对应文件还是文件夹
 * @param {String} path 路径
 */
export function isFile(path) {
  const stat = statSync(path)
  return stat ? stat.isFile() : false
}

/**
 * 获取文件名的基础部分
 * @param {String} filename 文件名
 */
export function getBasename(filename) {
  if (!filename) return filename
  const idx = filename.lastIndexOf('.')
  return idx >= 0 ? filename.substring(0, idx) : filename
}

/**
 * 获取文件名的后缀部分
 * @param {String} filename 文件名
 */
export function getExtension(filename) {
  if (!filename) return filename
  const idx = filename.lastIndexOf('.')
  return idx >= 0 ? filename.substring(idx + 1) : null
}

function getOrders(content) {
  if (!content) return {}
  const lines = content.split(/[\n|\r\n]/)
  return lines.filter(line => line.trim()).reduce((sort, line, index) => {
    sort[line.trim()] = index + 1
    return sort
  }, {})
}

/**
 * 根据顺序来获取文件列表
 * @param {String} dir 目录
 * @param  {...Function} filters 过滤器
 * @returns 
 */
export function listFilesByOrder(dir, ...filters) {
  const files = listFiles(dir, ...filters)
  const orderFile = listFiles(dir, (o) => /^\.order$/i)[0]
  if (!orderFile) return files
  const orders = getOrders(readFileSync(join(dir, orderFile.name)).toString())
  files.sort((a, b) => {
    const ao = orders[a.name] || orders[getBasename(a.name)] || 0
    const bo = orders[b.name] || orders[getBasename(b.name)] || 0
    return ao - bo
  })
  return files
}