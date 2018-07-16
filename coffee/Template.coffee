# Based on JSDoc template.js

'use strict'

path = require 'path'
fs   = require 'fs'
_    = require 'underscore'

class Template
  constructor: ( @scope, @layout, settings ) ->
    if typeof settings is 'string'
      @settings = variable: settings
    else
      @settings = settings or Object.assign {}, module.exports.settings

    @cache = {}

  _load: ( templatePath ) ->
    _.template fs.readFileSync( templatePath + '.tmpl', 'utf8' ), @settings

  partial: ( templatePath, data ) ->
    templatePath = path.join @scope, templatePath

    unless templatePath of @cache
      @cache[ templatePath ] = @_load templatePath

    @cache[ templatePath ].call this, data

  render: ( templatePath, data ) ->
    data.content = @partial templatePath, data
    @partial @layout, data

  @settings:
    variable: 'data'

module.exports = Template
