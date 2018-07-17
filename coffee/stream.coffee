'use strict'

stream = new ( require './FileStream' ) 'data'

if ! stream.file 'data.json'
  stream.file 'data.json', '{"profiles":[]}'

module.exports = stream
