const coreLogger = require('./core-logger')
const Namespace = require('./namespace')
const moduleIntrospector = require('./module-introspector')

const {
  APP_BASE,
  LOG_VOID,
} = require('./envars')

module.exports = function _logFn (logLevel, message, mergeObject = {}, logger = coreLogger, introspector = moduleIntrospector.initializer, basePath = APP_BASE) {
  if (LOG_VOID) return

  const [msg, mrgObj] = (typeof message !== 'string')
    ? ['', message]
    : [message, mergeObject]

  const [fn, module, lineNum] = introspector(basePath, 5)()
  const namespace = Namespace()
  const requestId = (namespace) ? namespace.get('REQUEST_ID') : null

  logger.child({ module, function: fn, lineNum, requestId })[logLevel](msg, mrgObj)
}
