const memoize = require('lodash.memoize')
const cls = require('cls-hooked')

const {
  APP_NAMESPACE,
} = require('./envars')

const memoizedNamespace = memoize(cls.getNamespace)

module.exports = function _namespace (namespace = APP_NAMESPACE) {
  return memoizedNamespace(namespace)
}
