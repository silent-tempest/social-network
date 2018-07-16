'use strict'

redirect = require './redirect'
Router   = require './Router'
layout   = require './layout'
stream   = require './stream'

router = new Router()

renderHTML = ( res, name, status, data = {} ) ->
  res.writeHead status, 'Content-Type': 'text/html'
  res.end layout.render name, data

router.get '/', ( req, res ) ->
  renderHTML res, 'index', 200

router.get '/404', ( req, res ) ->
  renderHTML res, '404', 404

router.get '/profile/:id', ( req, res ) ->
  profiles = JSON.parse stream.file 'profiles.json'

  if profiles[ req.params.id ]
    renderHTML res, 'profile', 200, profiles[ req.params.id ]
  else
    redirect '/404'

router.static 'static'

module.exports = router
