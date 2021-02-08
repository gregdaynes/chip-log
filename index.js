const pino = require('pino')
const cls = require('cls-hooked')
const memoize = require('lodash.memoize')
const moduleIntrospector = require('./module-introspector')

const LOG_LEVEL = process.env.LOG_LEVEL || 'info'
const APP_NAMESPACE = process.env.APP_NAMESPACE || 'APP_NAMESPACE'
const APP_BASE = process.env.NODE_PATH || process.cwd()
const LOG_VOID = process.env.LOG_VOID
const REDACT = process.env.REDEACT || 'req.body.password,req.params.password'

module.exports = new Proxy({}, {
  get: function (target, prop, receiver) {
    switch (prop) {
      case '_pino': return Pino
      case '_namespace': return _namespace
      case '_logFn': return _logFn

      // return logging function with bound level
      default:
        return _logFn.bind(null, prop)
    }
  },
})

const Pino = pino({
  level: LOG_LEVEL,
  redact: REDACT.split(','),
})

function _logFn (logLevel, message, mergeObject = {}, logger = Pino, introspector = moduleIntrospector.initializer, basePath = APP_BASE) {
  if (LOG_VOID) return

  const [msg, mrgObj] = (typeof message !== 'string')
    ? ['', message]
    : [message, mergeObject]

  const [fn, module, lineNum] = introspector(basePath, 5)()
  const namespace = _namespace()
  const requestId = (namespace) ? namespace.get('REQUEST_ID') : null

  logger.child({ module, function: fn, lineNum, requestId })[logLevel](msg, mrgObj)
}

const memoizedNamespace = memoize(cls.getNamespace)
function _namespace (namespace = APP_NAMESPACE) {
  return memoizedNamespace(namespace)
}
