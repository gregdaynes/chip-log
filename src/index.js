const logFn = require('./logger')

const middleware = {
  context: require('./middleware-context'),
  request: require('./middleware-request'),
}

module.exports = new Proxy({}, {
  get: function (target, prop, receiver) {
    switch (prop) {
      case 'middleware': return middleware

      // return logging function with bound level
      default:
        return logFn.bind(null, prop)
    }
  },
})
