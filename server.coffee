'use strict'

URLHandlers = require './coffee/compiled/URLHandlers.js'
FileStream  = require './coffee/compiled/FileStream.js'
Template    = require './coffee/compiled/Template.js'
http        = require 'http'

stream = new FileStream './data/'
layout = new Template 'views', 'layout'

unless stream.file 'profiles.json'
  stream.file 'profiles.json', '{}'

handlers = new URLHandlers()
  .add 'GET', /\.[a-z\-]+$/i, URLHandlers.static 'static'

  .add 'GET', '/', ( req, res ) ->
    res.writeHead 200, 'Content-Type': 'text/html'
    res.end 'Hello.'

  .add 'GET', '/profile/:id', ( req, res ) ->
    profiles = JSON.parse stream.file 'profiles.json'

    if req.params.id of profiles
      res.writeHead 200, 'Content-Type': 'text/html'
      res.end layout.render 'profile', profiles[ req.params.id ]
    else
      res.writeHead 404, 'Content-Type': 'text/html'
      res.end layout.render 'error', status: 404, message: 'Unknown profile.'

server = http.createServer ( req, res ) ->
  if ( handler = handlers.handle req, res )
    handler req, res
  else
    # send an error

server.listen 9000, ->
  console.log 'Listening "http://localhost:9000/"...'
