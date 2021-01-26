const path = require('path')

module.exports = {
  initializer,
  parseBasePath,
  getInvoker,
  normalizeInvoker,
  invokerToModule,
  moduleIntrospector
}

function initializer (basePath, depth) {
  if (!basePath) throw new Error('basePath is required')

  return moduleIntrospector.bind(null, basePath, depth)
}

function parseBasePath (basePath) {
  // ensure last character is a directory slash
  const normalizedPath = (basePath.slice(-1) !== path.sep)
    ? basePath + path.sep
    : basePath

  return normalizedPath
    // if path has ./ in it, strip it out
    .split(/^\.\//)
    .pop()
    .split(/^\//)
    // return last entry after split
    .pop()
}

function getInvoker (depth) {
  return new Error()
    .stack
    .split('\n')[depth]
    .trim()
    .replace(/at/, '')
    .replace(/\//, '')
    .replace(/\.js/, '')
    .replace(/\(/, '')
    .replace(/\)/, '')
    .trim()
}

function normalizeInvoker (invoker) {
  const [filePath, fn = '<anonymous>'] = invoker.split(' ').reverse()
  return [filePath, fn]
}

function invokerToModule (invokerPath, root) {
  const [moduleName, line] = invokerPath
    .split(root)
    .reverse()[0]
    .replace(/\//, '')
    .split(':')
    .slice(0, 2)

  return [moduleName, Number(line)]
}

function moduleIntrospector (basePath, depth) {
  const root = parseBasePath(basePath)
  const invoker = getInvoker(depth)
  const [invokerPath, invokingFunction] = normalizeInvoker(invoker)
  const [moduleName, line] = invokerToModule(invokerPath, root)

  return [invokingFunction, moduleName, line]
}
