'use strict'

qs       = require 'qs'

redirect = require './redirect'
Router   = require './Router'
layout   = require './layout'
stream   = require './stream'

renderHTML = ( res, name, status, data = {} ) ->
  res.writeHead status, 'Content-Type': 'text/html'
  res.end layout.render name, data

router = new Router
  body:
    'application/json':                  JSON.parse
    'application/x-www-form-urlencoded': qs.parse

  query: qs.parse

router.get '/', ( req, res ) ->
  renderHTML res, 'index', 200

router.get '/404', ( req, res ) ->
  renderHTML res, '404', 404

router.get '/profile/:id', ( req, res ) ->
  data = JSON.parse stream.get 'data.json'

  if data.profiles[ req.params.id ]
    renderHTML res, 'profile', 200, data.profiles[ req.params.id ]
  else
    redirect res, '/404/'

router.post '/sign-up', ( req, res ) ->
  data = JSON.parse stream.get 'data.json'

  if data.profiles.find ( { username } ) -> username is req.body.username
    res.writeHead 409, 'Content-Type': 'text/plain'
    res.end "\"#{req.body.username}\" user already exists! change the username to another one."
  else
    data.profiles.push req.body
    stream.set 'data.json', JSON.stringify data
    res.writeHead 200, 'Content-Type': 'text/plain'
    res.end "\"#{req.body.username}\" account was created! url: localhost:9000/profile/#{data.profiles.length - 1}"

router.static 'static'

module.exports = router
