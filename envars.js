module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  APP_NAMESPACE: process.env.APP_NAMESPACE || 'APP_NAMESPACE',
  APP_BASE: process.env.NODE_PATH || process.cwd(),
  LOG_VOID: process.env.LOG_VOID,
  REDACT: process.env.REDEACT || 'req.body.password,req.params.password',
}
