'use strict'

path = require 'path'

File = require './File'

class FileManager
  constructor: ( @scope ) ->
    @cache = {}

create = ( give ) ->
  return ( filepath, content ) ->
    filepath = path.join @scope, filepath

    if ! @cache[ filepath ]
      @cache[ filepath ] = new File filepath

    if give
      return @cache[ filepath ].get()

    @cache[ filepath ].set content

FileManager::get = create true

FileManager::set = create()

module.exports = FileManager
