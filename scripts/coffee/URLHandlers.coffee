
'use strict'

module.exports = class
  constructor: ->
    @handlers = []

  add: ( method, pattern, handler ) ->
    params = []

    if typeof pattern is 'string'
      pattern = pattern.replace /:([_a-z][_a-z0-9]*)/g, ( a, b ) ->
        unless ~ params.indexOf b
          params.push b
        else
          throw Error 'You have the same param name: ' + b

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
