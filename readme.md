A simple structured logger that provides extended attributes:

- module, function name, and line number of the caller
- requestId pulled from async hook in the request (provided by the middleware)
- context middleware logger for associating logs to a request
- - request_id attribute on logs called after middleware
- request logging middleware for express
- - log request params and response, diagnostic info, and Request ID if using context middleware

```sh
[1611629195127] INFO     (17914 on evil.lan): nested
    module: "example-appserver"
    function: "nestedHandler"
    lineNum: 6
    requestId: "10279b7c-69fe-4767-b36a-80f6b0b2266c"
[1611629195128] INFO     (17914 on evil.lan): finished
    module: "example-appserver"
    function: "helloWorldHandler"
    lineNum: 12
    requestId: "10279b7c-69fe-4767-b36a-80f6b0b2266c"
```

## Options

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
