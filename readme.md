- [Installation](#installation)
- - [General Logger](#use-as-a-general-purpose-logger)
- - [Express Logging](#use-with-express)
- [Levels](#log-levels)
- [Configuration](#configuration)
- [Debug Wrapping](#debug-wrapper)
- [Middleware](#middleware)
- - [Context](#context-middleware)
- - [Request](#request-middleware)
- [Example Application](#example-application)


Chip-log provides NodeJS with structured logging which includes extended attributes

- module, function name, and line number of the caller
- requestId pulled from async hook in the request (express)
- request logging (express)
- wrapper for Debug for faster debug logs

```sh
# Examples below using pino-pretty as formatter

[1611629195127] INFO (17914 on evil.lan): nested
    module: "example-appserver"
    function: "nestedHandler"
    lineNum: 6
    requestId: "10279b7c-69fe-4767-b36a-80f6b0b2266c"
    payload: {
      myData: "example payload"
    }
[1611629195128] INFO (17914 on evil.lan): finished
    module: "example-appserver"
    function: "helloWorldHandler"
    lineNum: 12
    requestId: "10279b7c-69fe-4767-b36a-80f6b0b2266c"
```

## Installation

Requirements

- NodeJS 14+
- [optional] Express v4+

### Use as a general purpose logger

Import chip-log and call the log level with a message, a json object, or both

```
const log = require('chip-log');

log.info('hello world')
log.error(err.message, { error })
```

### Use with Express

See [example-app](#example-application) below,
or the [Chip-Log Repo](https://github.com/gregdaynes/chip-log/tree/main/example-app) on Github

## Log Levels

- error
- warn
- info
- debug
- trace
- fatal
- silent

## Configuration

Envars to configure

Minimum log level to dispatch, default: `info`
```
LOG_LEVEL=trace|debug|info|warn|error|fatal
```

Namespace for the async hook context, default: `APP_NAMESPACE`
```
APP_NAMESPACE=My_Application
```

Path to the entry directory of the application (defaults to current working directory the node process is started in)
```
APP_BASE=./src
```

Disable logging, like during tests
```
LOG_VOID=true
```

Redacting specific paths in logs
```
REDACT='req.body.password,req.params.password
```

## Debug Wrapping

To wrap debug messages provided from [Debug](https://npm.im/debug), ensure Chip-Log is the first import of the entry file for your module.

## Middleware

__requires Express v4+__

### Context Middleware

Using NodeJS Async Hooks, attach a Request ID to a request. When logging in a function as part of a Express request, the `requestId` will be one of the attributes on the log

In your application setup for express, when declaring middleware `.use()`,
aim to add the `context` middleware as close to being first as possible.

```
const app = require('express')()
const { context } = require('chip-log').middleware;

app.use(context())
```

```sh
# example output using pino-pretty

[1611629195128] INFO (17914 on evil.lan): finished
    module: "example-appserver"
    function: "helloWorldHandler"
    lineNum: 12
    requestId: "10279b7c-69fe-4767-b36a-80f6b0b2266c"
```

### Request Middleware

Provides details of the request and response from Express for a request. If used with Context middleware, the log will also contain the `requestId`

In your application setup for express, when declaring middleware `.use()`,
you can place `request` anywhere before routes are declared.
If using with the Context middleware, place anywhere after, before the routes

```
const app = require('express')()
const { context, request } = require('chip-log').middleware;

app.use(context())
app.use(request())
```

```sh
# example output using pino-pretty

[1612893183539] INFO (25216 on RR3D-MAC0005.lan): request completed
    req: {
      "id": "8c276c5d-2717-47b5-8dbf-c4d33964e057",
      "method": "GET",
      "url": "/favicon.ico",
      "headers": {
        "host": "localhost:3000",
        "connection": "keep-alive",
        "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
        "sec-ch-ua-mobile": "?0",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
        "accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-dest": "image",
        "referer": "http://localhost:3000/",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9"
      },
      "remoteAddress": "::1",
      "remotePort": 50622
    }
    requestId: "8c276c5d-2717-47b5-8dbf-c4d33964e057"
    res: {
      "statusCode": 404,
      "headers": {
        "x-powered-by": "Express",
        "content-security-policy": "default-src 'none'",
        "x-content-type-options": "nosniff",
        "content-type": "text/html; charset=utf-8",
        "content-length": 150
      }
    }
    responseTime: 2
```

## Example Application

```javascript
const app = require('express')()
const log = require('chip-log')

const {
  context,
  request,
} = log.middleware

const nestedHandler = () => {
  log.info('nested')
}

const helloWorldHandler = (req, res) => {
  nestedHandler()

  log.info('finished', { test: 'one' })
  res.send('Hello world')
}

app.use(context())
app.use(request())
app.get('/', helloWorldHandler)

app.listen(3000, () => log.info('Running'))
```

