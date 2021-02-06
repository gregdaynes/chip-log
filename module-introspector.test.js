const {
  initializer,
  parseBasePath,
  getInvoker,
  normalizeInvoker,
  invokerToModule,
  moduleIntrospector,
} = require('./module-introspector')

describe('Module Introspector', () => {
  describe('initializer', () => {
    it('is an initializer function', () => {
      const actual = initializer('./src')

      expect(typeof actual).toBe('function')
    })

    it('requires a path as it\'s only parameter', () => {
      const actual = () => initializer()

      expect(actual).toThrow('basePath is required')
    })
  })

  describe('parseBasePath', () => {
    it('handles a fully qualified path', () => {
      const basePath = process.cwd()
      const actual = parseBasePath(basePath).split('/').slice(-2).join('/')

      expect(actual).toBe('logger/')
    })

    it('handles a relative path with ./ prefix', () => {
      const basePath = './src/'
      const actual = parseBasePath(basePath)

      expect(actual).toBe('src/')
    })

    it('handles a relative path without ./ prefix', () => {
      const basePath = 'src/'
      const actual = parseBasePath(basePath)

      expect(actual).toBe('src/')
    })
  })

  describe('getInvoker', () => {
    it('returns the filename and function that called', () => {
      const [actualCall, qualifiedPath] = getInvoker(2).split(' ')
      // get filename, ignore line number and charAt
      const actualFile = qualifiedPath.split('/').pop().split(':')[0]

      // this test is an anonymous function
      expect(actualCall).toBe('Object.<anonymous>')
      // this test suite filename
      expect(actualFile).toBe('module-introspector.test')
    })
  })

  describe('normalizeInvoker', () => {
    it('describes the function name as a child of Object if called from anonymouse function', () => {
      const invoker = getInvoker(2)
      const [qualifiedPath, actualInvokingFunction] = normalizeInvoker(invoker)
      const actualFile = qualifiedPath.split('/').pop().split(':')[0]

      // this test is an anonymous function
      expect(actualInvokingFunction).toBe('Object.<anonymous>')
      // this test suite filename
      expect(actualFile).toBe('module-introspector.test')
    })

    it('uses the function name if called from a named function', () => {
      function invokingFunction () {
        return normalizeInvoker(getInvoker(2))
      }

      const [qualifiedPath, actualInvokingFunction] = invokingFunction()
      const actualFile = qualifiedPath.split('/').pop().split(':')[0]

      // this test is an anonymous function
      expect(actualInvokingFunction).toBe('invokingFunction')
      // this test suite filename
      expect(actualFile).toBe('module-introspector.test')
    })

    it('describes the function as anonymous if called from top level', () => {
      // impossible to test due to call from top level module being a requirement
      // the output on the error line would be the same as others without
      // the space separation
      const invoker = 'root/logger/module-introspector.test:61:23'
      const [qualifiedPath, actualInvokingFunction] = normalizeInvoker(invoker)
      const actualFile = qualifiedPath.split('/').pop().split(':')[0]

      expect(actualInvokingFunction).toBe('<anonymous>')
      // this test suite filename
      expect(actualFile).toBe('module-introspector.test')
    })
  })

  describe('invokerToModule', () => {
    it('splits the invoker path returning the module name an line number', () => {
      const invokerPath = 'root/logger/module-introspector.test:61:23'
      const parsedBasePath = 'root/logger/'

      const [actualModule, actualLineNumber] = invokerToModule(invokerPath, parsedBasePath)

      expect(actualModule).toBe('module-introspector.test')
      expect(actualLineNumber).toBe(61)
    })
  })

  describe('moduleIntrospector', () => {
    it('returns the invoking function, module called from and line number of call', () => {
      const basePath = './logger'
      const depth = 3
      const [
        actualInvokingFunction,
        actualModuleName,
        actualLineNumber,
      ] = moduleIntrospector(basePath, depth)

      // this test is an anonymous function
      expect(actualInvokingFunction).toBe('Object.<anonymous>')
      // this test suite filename
      expect(actualModuleName).toBe('module-introspector.test')
      // the line number the function was run on above
      expect(actualLineNumber).toBe(121)
    })
  })
})
