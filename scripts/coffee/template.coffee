# Based on JSDoc template.js

'use strict'

fs = require 'fs'
_  = require 'underscore'

module.exports = ( path, layout, settings ) ->
  return new Template path, layout, settings

module.exports.Template = class Template
  constructor: ( @path, @layout, settings ) ->
    if typeof settings is 'string'
      @settings = variable: settings
    else
      @settings = settings or Object.assign {}, Template.settings

    @cache = {}

  load: ( path ) ->
    _.template fs.readFileSync( path, 'utf8' ), @settings

  partial: ( path, data ) ->
    path = @path + path

    unless path of @cache
      @cache[ path ] = @load path

    @cache[ path ].call this, data

  render: ( path, data ) ->
    data.content = @partial path, data
    @partial @layout, data

  @settings:
    variable: 'data'
