const cls = require('cls-hooked')
const memoize = require('lodash.memoize')
const coreLogger = require('./core-logger')
const moduleIntrospector = require('./module-introspector')

const {
  APP_BASE,
  APP_NAMESPACE,
  LOG_VOID,
} = require('./envars')

module.exports = new Proxy({}, {
  get: function (target, prop, receiver) {
    switch (prop) {
      case '_pino': return coreLogger
      case '_namespace': return _namespace
      case '_logFn': return _logFn

      // return logging function with bound level
      default:
        return _logFn.bind(null, prop)
    }
  },
})

function _logFn (logLevel, message, mergeObject = {}, logger = coreLogger, introspector = moduleIntrospector.initializer, basePath = APP_BASE) {
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
