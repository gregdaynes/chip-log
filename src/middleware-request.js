const coreLogger = require('./core-logger')
const httpLogger = require('pino-http')
const namespace = require('./namespace')

module.exports = function requestLogger (applicationNamespace = namespace()) {
  const logRequest = httpLogger({
    logger: coreLogger,
    genReqId: () => applicationNamespace.get('REQUEST_ID'),
    reqCustomProps: function (req) {
      return {
        requestId: req.id,
      }
    },
  })

  return function requestLogger (req, res, next) {
    logRequest(req, res)

    next()
  }
}
