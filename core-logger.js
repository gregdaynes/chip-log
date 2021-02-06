const Pino = require('pino')
const {
  LOG_LEVEL,
  REDACT,
} = require('./envars')

const pino = Pino({
  level: LOG_LEVEL,
  redact: REDACT.split(','),
})

module.exports = pino
