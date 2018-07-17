'use strict'

path = require 'path'

File = require './File'

class FileStream
  constructor: ( @scope ) ->
    @cache = {}

  file: ( filepath, content ) ->
    filepath = path.join @scope, filepath

    unless filepath of @cache
      @cache[ filepath ] = new File filepath

    unless content ?
      return @cache[ filepath ].read()

    @cache[ filepath ].write content

  json: ( filepath, content ) -> null

module.exports = FileStream
