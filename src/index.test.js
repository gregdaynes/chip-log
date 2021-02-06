const { _logFn, _namespace } = require('./index')
const cls = require('cls-hooked')

const namespace = 'APP_NAMESPACE'

beforeAll(() => {
  cls.createNamespace(namespace)
})

describe('_logFn', () => {
  it('calls the parent logger through child', (done) => {
    const appNamespace = cls.getNamespace(namespace)
    appNamespace.run(() => runTestWithContext())

    function runTestWithContext () {
      const requestId = 'abc123'
      appNamespace.set('REQUEST_ID', requestId)

      const logLevel = 'info'
      const logger = {
        child: jest.fn(() => ({
          [logLevel]: jest.fn(),
        })),
      }

      const introspector = () => jest.fn(() => {
        return [
          'testFn',
          'this.test.file',
          666,
        ]
      })

      _logFn(logLevel, 'under test', {}, logger, introspector, 'basePath')

      expect(logger.child).toHaveBeenCalledWith({
        function: 'testFn',
        lineNum: 666,
        module: 'this.test.file',
        requestId,
      })

      done()
    }
  })
})

describe('_namespace', () => {
  it('fetches the namespace from async hook', () => {
    const actual = _namespace(namespace).name

    expect(actual).toBe(namespace)
  })

  it('uses memoization on multiple calls', () => {
    const actual = _namespace(namespace)
    const actualTwo = _namespace(namespace)

    expect(actual).toBe(actualTwo)
  })
})
