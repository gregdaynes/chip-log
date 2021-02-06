const app = require('express')()
const logger = require('../index')
const requestContext = require('../context-middleware')
const requestLogger = require('../request-middleware')

const nestedHandler = () => {
  logger.info('nested')
}

const helloWorldHandler = (req, res) => {
  nestedHandler()

  logger.info('finished')
  res.send('Hello world')
}

app.use(requestContext())
app.use(requestLogger())
app.get('/', helloWorldHandler)

app.listen(3000, () => {})
