'use strict'

fs = require 'fs'

class File
  constructor: ( @path ) ->
    @loaded = false

  get: ->
    if ! @loaded
      if fs.existsSync @path
        @content = fs.readFileSync @path, 'utf8'
        @loaded = true
      else
        @content = ''

    return @content

  set: ( content ) ->
    fs.writeFileSync @path, @content = content

module.exports = File
