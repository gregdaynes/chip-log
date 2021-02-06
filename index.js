const coreLogger = require('./core-logger')
const namespace = require('./namespace')
const logFn = require('./logger')

module.exports = new Proxy({}, {
  get: function (target, prop, receiver) {
    switch (prop) {
      case '_pino': return coreLogger
      case '_namespace': return namespace
      case '_logFn': return logFn

      // return logging function with bound level
      default:
        return logFn.bind(null, prop)
    }
  },
})
