'use strict'

mime = require 'mime'
path = require 'path'
url  = require 'url'
fs   = require 'fs'

module.exports = class
  constructor: ->
    @handlers = []

  add: ( method, pattern, handler ) ->
    params = []

    if typeof pattern is 'string'
      pattern = pattern.replace /:([_a-z][_a-z0-9]*)/gi, ( a, b ) ->
        if ~ params.indexOf b
          throw Error 'You have the same param name: ' + b

        params.push b

        return '([^/]+?)'

      pattern = RegExp '^' + pattern + '/?$'

    @handlers.push { method, pattern, handler, params }

    return this

  handle: ( req, res ) ->
    for { method, pattern, handler, params } in @handlers
      unless method is req.method and ( match = pattern.exec req.url )
        continue

      req.params = {}

      for i in [ 0 ... params.length ]
        req.params[ params[ i ] ] = match[ i + 1 ]

      return handler

  parseURL: ( req ) ->
    # console.log url.parse req.url

    if req.headers.referer
      # match protocol and host
      return req.url.slice req.headers.referer.replace( /^(?:[a-z]+:\/\/)(?:[\w.]+(?::\d+)?)/gi, '' ).length

    return req.url

module.exports.static = ( scope ) ->
  ( req, res ) ->
    filepath = path.join scope, req.url

    if ( type = mime.getType filepath )
      headers = 'Content-Type': type

    fs.access filepath, fs.constants.F_OK | fs.constants.R_OK, ( err ) ->
      if err
        res.writeHead 404, headers
        res.end()
        return

      fs.readFile filepath, 'utf8', ( err, data ) ->
        if err
          res.writeHead 404, headers
          res.end()
        else
          res.writeHead 200, headers
          res.end data