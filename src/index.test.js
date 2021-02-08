const logFn = require('./logger')
const namespace = require('./namespace')
const cls = require('cls-hooked')

const APP_NAMESPACE = 'APP_NAMESPACE'

beforeAll(() => {
  cls.createNamespace(APP_NAMESPACE)
})

describe('logFn', () => {
  it('calls the parent logger through child', (done) => {
    const appNamespace = cls.getNamespace(APP_NAMESPACE)
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

      logFn(logLevel, 'under test', {}, logger, introspector, 'basePath')

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

describe('namespace', () => {
  it('fetches the namespace from async hook', () => {
    const actual = namespace(APP_NAMESPACE).name

    expect(actual).toBe(APP_NAMESPACE)
  })

  it('uses memoization on multiple calls', () => {
    const actual = namespace(APP_NAMESPACE)
    const actualTwo = namespace(APP_NAMESPACE)

    expect(actual).toBe(actualTwo)
  })
})
