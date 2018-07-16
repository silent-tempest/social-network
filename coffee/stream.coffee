'use strict'

stream = new ( require './FileStream' ) 'data'

if ! stream.file 'profiles.json'
  stream.file 'profiles.json', '{}'

module.exports = stream
