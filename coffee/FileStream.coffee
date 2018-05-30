'use strict'

File = require './File.js'
path = require 'path'

module.exports = class
  constructor: ( @scope ) ->
    @cache = {}

  file: ( filepath, content ) ->
    filepath = path.join @scope, filepath

    unless filepath of @cache
      @cache[ filepath ] = new File filepath

    if content?
      @cache[ filepath ].write content
    else
      @cache[ filepath ].read()
