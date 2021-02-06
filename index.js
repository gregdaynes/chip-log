const coreLogger = require('./core-logger')
const namespace = require('./namespace')
const logFn = require('./logger')

const middleware = {
  context: require('./middleware-context'),
  request: require('./middleware-request'),
}

module.exports = new Proxy({}, {
  get: function (target, prop, receiver) {
    switch (prop) {
      case '_pino': return coreLogger
      case '_namespace': return namespace
      case '_logFn': return logFn
      case 'middleware': return middleware

      // return logging function with bound level
      default:
        return logFn.bind(null, prop)
    }
  },
})
