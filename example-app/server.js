const app = require('express')()
const logger = require('../index')
const requestContext = require('../middleware')

const nestedHandler = () => {
  logger.info('nested')
}

const helloWorldHandler = (req, res) => {
  nestedHandler()

  logger.info('finished')
  res.send('Hello world')
}

app.use(requestContext())
app.get('/', helloWorldHandler)

app.listen(3000, () => {})
