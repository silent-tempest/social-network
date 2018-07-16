'use strict'

module.exports = ( res, Location ) ->
  res.writeHead 302, { Location }
  res.end()
