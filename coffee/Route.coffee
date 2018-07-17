'use strict'

class Route
  constructor: ( @method, pattern, @handler, @router ) ->
    params = []

    if typeof pattern is 'string'
      regex = pattern.replace /:([_a-z$][_a-z0-9$]*)/gi, ( raw, name ) ->
        if ~ params.indexOf name
          throw Error 'You have the same parameter name: ' + name

        params.push name

        return '([^/]+?)'

      pattern   = RegExp '^' + regex + '/?$'
      @_pattern = RegExp '^' + regex + '/?'

    @pattern = pattern
    @params  = params

  handles: ( req, url = req.url ) ->
    return @method is req.method and @pattern.test url

  process: ( req, url = req.url ) ->
    return new Promise ( res, rej ) =>
      req.params = {}
      req.body   = ''

      if @params.length
        match = @pattern.exec url

        for i in [ 0 ... @params.length ]
          req.params[ @params[ i ] ] = match[ i + 1 ]

      if req.method isnt 'POST'
        return res()

      req.on 'data', ( chunk ) ->
        req.body += chunk

        if req.body.length >= 1e6
          req.connection.destroy()
          rej 413

      req.on 'end', =>
        try
          if @router.config.body and ( ContentType = req.headers[ 'content-type' ] )
            for type, parse of @router.config.body
              if hasOwnProperty.call( @router.config.body, type ) and ! ContentType.indexOf type
                req.body = parse req.body
                break

          res()
        catch ex
          rej 400

module.exports = Route
