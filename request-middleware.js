const logger = require('./index')
const httpLogger = require('pino-http')

module.exports = function requestLogger (applicationNamespace = logger._namespace()) {
  const logRequest = httpLogger({
    logger: logger._pino,
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
