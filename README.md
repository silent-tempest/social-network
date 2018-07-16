# Social Network

A social network written without [Express](http://expressjs.com/).

### Starting from Scratch

##### Install Dependencies

Install [underscore](http://underscorejs.org/) for [templating](http://underscorejs.org/#template).

Install [mime](https://github.com/broofa/node-mime) to determine the MIME type of a static file.

`npm i`

##### Install [CoffeeScript](https://coffeescript.org)

If you will write some [CoffeeScript](https://coffeescript.org) in the project you need to compile it.

`npm i -g coffeescript`

##### Install [Nodemon](https://nodemon.io)

[Nodemon](https://nodemon.io) will automatically restart the server on change.

`npm i -g nodemon`

### Compile [CoffeeScript](https://coffeescript.org)

`coffee -wm -o ./static/coffee/compiled ./static/coffee`

### Run

##### Run with [Nodemon](https://nodemon.io)

`nodemon server.coffee`

##### Or without

`coffee server.coffee`
