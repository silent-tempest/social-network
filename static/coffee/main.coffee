'use strict'

ajax = require 'peako/ajax'

console.log 'It works!'

signup.onsubmit = ( event ) ->
  event.preventDefault()

  data =
    username: username.value
    password: password.value

  ajax '/sign-up',
    success: ( data ) ->
      console.log 'Successfully sent'

    error: ->
      console.error 'Error %d: "%s"', @status, @statusText

    headers:
      'Content-Type': 'application/json'

    data: data

  console.log 'Sent', data
