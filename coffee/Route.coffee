'use strict'

class Route
  constructor: ( @method, pattern, @handler ) ->
    params = []

    if typeof pattern is 'string'
      regex = pattern.replace /:([_a-z$][_a-z0-9$]*)/gi, ( raw, name ) ->
        if ~ params.indexOf name
          throw Error 'You have the same parameter name: ' + name

        params.push name

        return '([^/]+?)'

      regex = '^' + regex + '/?'

      pattern = RegExp regex + '$'
      @_pattern = RegExp regex

    @pattern = pattern
    @params  = params

  handles: ( req, url = req.url ) ->
    return @method is req.method and @pattern.test url

  process: ( req, url = req.url ) ->
    match = @pattern.exec url

    req.params = {}

    for i in [ 0 ... @params.length ]
      req.params[ @params[ i ] ] = match[ i + 1 ]

module.exports = Route
