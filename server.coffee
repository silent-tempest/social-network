'use strict'

http     = require 'http'

redirect = require './coffee/redirect'
router   = require './coffee/router'

server = http.createServer ( req, res ) ->
  router.process req

  if req.method is 'GET' and req.url[ req.url.length - 1 ] isnt '/'
    redirect res, req.url + '/' + req.rawQuery
  else if ( route = router.handle req )
    route.process req
      .then ->
        route.handler req, res
      .catch ( statusCode ) ->
        if typeof statusCode isnt 'number'
          return Promise.reject statusCode

        res.writeHead statusCode, 'Content-Type': 'text/plain'

        if statusCode is 413
          req.connection.destroy()
        else
          res.end()
      .catch ( error ) ->
        res.writeHead 500, 'Content-Type': 'text/plain'
        res.end()
        console.log error
  else
    redirect res, '/404/'

server.listen 9000, ->
  console.log 'Listening "http://localhost:9000/"...'
