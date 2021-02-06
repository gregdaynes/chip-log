const app = require('express')()
const logger = require('../src')
const {
  context,
  request,
} = logger.middleware

const nestedHandler = () => {
  logger.info('nested')
}

const helloWorldHandler = (req, res) => {
  nestedHandler()

  logger.info('finished', { test: 'one' })
  res.send('Hello world')
}

app.use(context())
app.use(request())
app.get('/', helloWorldHandler)

app.listen(3000, () => {})
