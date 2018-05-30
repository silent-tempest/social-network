'use strict'

fs = require 'fs'

module.exports = class
  constructor: ( @path ) ->
    @loaded = false

  read: ->
    unless @loaded
      if fs.existsSync @path
        @content = fs.readFileSync @path, 'utf8'
        @loaded = true
      else
        @content = ''

    @content

  write: ( content ) ->
    # i think that better is to reset cache
    fs.writeFileSync @path, @content = content
