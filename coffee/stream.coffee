'use strict'

stream = new ( require './FileManager' ) 'data'

if ! stream.get 'data.json'
  stream.set 'data.json', '{"profiles":[]}'

module.exports = stream
