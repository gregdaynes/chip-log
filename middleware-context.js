const { v4 } = require('uuid')
const { createNamespace } = require('cls-hooked')
const { APP_NAMESPACE } = require('./envars')

module.exports = function requestContext (appNamespace = APP_NAMESPACE) {
  const applicationNamespace = createNamespace(appNamespace)

  return function requestContext (req, res, next) {
    applicationNamespace.run(() => {
      attachContext(applicationNamespace, next)
    })
  }
}

function attachContext (applicationNamespace, next) {
  applicationNamespace.set('REQUEST_ID', v4())

  next()
}
