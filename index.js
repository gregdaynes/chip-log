const pino = require('pino')
const cls = require('cls-hooked')
const memoize = require('lodash.memoize')
const moduleIntrospector = require('./module-introspector')

const LOG_LEVEL = process.env.LOG_LEVEL || 'info'
const APP_NAMESPACE = process.env.APP_NAMESPACE || 'APP_NAMESPACE'
const APP_BASE = process.env.NODE_PATH || process.cwd()
const LOG_VOID = process.env.LOG_VOID
const REDACT = process.env.REDEACT || 'req.body.password,req.params.password'

module.exports = {
  _logFn,
  _namespace,
  trace: (msg, mrg) => (_logFn.bind(null, 'trace')(msg, mrg)),
  info: (msg, mrg) => (_logFn.bind(null, 'info')(msg, mrg)),
  warn: (msg, mrg) => (_logFn.bind(null, 'warn')(msg, mrg)),
  error: (msg, mrg) => (_logFn.bind(null, 'error')(msg, mrg)),
  fatal: (msg, mrg) => (_logFn.bind(null, 'fatal')(msg, mrg)),
  debug: (msg, mrg) => (_logFn.bind(null, 'debug')(msg, mrg))
}

const Pino = pino({
  level: LOG_LEVEL,
  redact: REDACT.split(','),
})

function _logFn (logLevel, message, mergeObject = null, logger = Pino, introspector = moduleIntrospector.initializer, basePath = APP_BASE) {
  if (LOG_VOID) return

  const [fn, module, lineNum] = introspector(basePath, 5)()
  const namespace = _namespace()
  const requestId = (namespace) ? namespace.get('REQUEST_ID') : null

  return logger.child({ module, function: fn, lineNum, requestId })[logLevel](mergeObject, message)
}

const memoizedNamespace = memoize(cls.getNamespace)
function _namespace (namespace = APP_NAMESPACE) {
  return memoizedNamespace(namespace)
}
