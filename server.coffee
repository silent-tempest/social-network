'use strict'

URLHandlers = require './scripts/URLHandlers.js'
template    = require './scripts/template.js'
http        = require 'http'
fs          = require 'fs'

handlers = new URLHandlers()
  .add 'GET', '/', ( req, res ) ->
    res.writeHead 200, 'Content-Type': 'text/html'
    res.end 'Hello.'

  .add 'GET', '/:value', ( req, res ) ->
    res.writeHead 200, 'Content-Type': 'text/html'
    res.end req.params.value

server = http.createServer ( req, res ) ->
  if ( handler = handlers.handle req, res )
    handler req, res
  else
    # send an error

server.listen 9000, ->
  console.log 'Listening "http://localhost:9000/"...'
