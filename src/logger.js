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

  // don't report an empty payload if there is no params passed
  const payload = (mrgObj && Object.keys(mrgObj).length)
    ? { payload: { ...mrgObj } }
    : null

  const info = { module, function: fn, lineNum, requestId }

  logger.child(info)[logLevel](payload, msg)
}
