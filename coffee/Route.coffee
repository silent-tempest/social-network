'use strict'

qs = require 'qs'

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

    req.body = []

    if req.method isnt 'POST'
      return Promise.resolve()

    return new Promise ( res, rej ) ->
      req.on 'data', ( chunk ) ->
        req.body.push chunk

      req.on 'end', ->
        req.body = Buffer.concat( req.body ).toString()

        if req.headers[ 'content-type' ]
          if ! req.headers[ 'content-type' ].indexOf 'application/json'
            req.body = JSON.parse req.body
          else if ! req.headers[ 'content-type' ].indexOf 'application/x-www-form-urlencoded'
            req.body = qs.parse req.body

        res()

module.exports = Route
