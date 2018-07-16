'use strict'

path  = require 'path'
mime  = require 'mime'
fs    = require 'fs'

Route = require './Route'

class Router
  constructor: ->
    @routes = []

  handle: ( req, url = req.url ) ->
    if url[ url.length - 1 ] isnt '/' and ( route = @handle req, url + '/' )
      return route

    for route in @routes
      if route.handles req
        return route

    return null

  static: ( scope ) ->
    self = this

    @get /\.[a-z\-]+\/$/i, ( req, res ) ->
      filepath = url = req.url.slice 0, -1

      for route in self.routes
        test = url.replace route._pattern or route.pattern, ''

        if test.length < filepath.length
          filepath = test

      filepath = path.join scope, filepath

      if ( type = mime.getType filepath )
        headers = 'Content-Type': type

      access = new Promise ( res, rej ) ->
        fs.access filepath, fs.constants.F_OK | fs.constants.R_OK, ( err ) ->
          if err
            return rej err

          fs.readFile filepath, 'utf8', ( err, data ) ->
            if err
              rej err
            else
              res data

      access.then ( data ) ->
        res.writeHead 200, headers
        res.end data

      access.catch ( err ) ->
        res.writeHead 404, headers
        res.end()

    return this

[ 'GET', 'POST' ].forEach ( method ) ->
  Router::[ method.toLowerCase() ] = ( pattern, handler ) ->
    @routes.push new Route method, pattern, handler
    return this

module.exports = Router
