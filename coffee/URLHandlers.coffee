'use strict'

path = require 'path'
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

module.exports.static = ( scope ) ->
  ( req, res ) ->
    url = path.join scope, req.url

    if /\.([a-z\-]+)$/i.exec url and RegExp.$1 of mime
      headers = 'Content-Type': mime[ RegExp.$1 ]

    fs.access url, fs.constants.F_OK | fs.constants.R_OK, ( err ) ->
      if err
        res.writeHead 404, headers
        res.end()
        return

      fs.readFile url, 'utf8', ( err, data ) ->
        if err
          res.writeHead 404, headers
          res.end()
        else
          res.writeHead 200, headers
          res.end data