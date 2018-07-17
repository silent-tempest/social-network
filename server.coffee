'use strict'

http     = require 'http'

redirect = require './coffee/redirect'
router   = require './coffee/router'

server = http.createServer ( req, res ) ->
  if req.url.includes '?'
    console.log 'has params', req.url

  if req.method is 'GET' and req.url[ req.url.length - 1 ] isnt '/'
    redirect res, req.url + '/'
  else if ( route = router.handle req )
    route.process( req ).then -> route.handler req, res
  else
    redirect res, '/404/'

server.listen 9000, ->
  console.log 'Listening "http://localhost:9000/"...'
