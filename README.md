# Social Network

A social network written without [Express](http://expressjs.com/).

### Starting from Scratch

##### Install Dependencies

Install [underscore.js](http://underscorejs.org/) for [templating](http://underscorejs.org/#template).

`npm i`

##### Install [CoffeeScript](https://coffeescript.org)

If you will write some [CoffeeScript](https://coffeescript.org) in the project you need to compile it.

`npm i -g coffeescript`

##### Install [Nodemon](https://nodemon.io)

[Nodemon](https://nodemon.io) will automatically restart the server when it is changed.

`npm i -g nodemon`

### Compile [CoffeeScript](https://coffeescript.org)

The `-w` (`--watch`) flag means that coffee will watch changes of the files.

The `-m` (`--map`) flag means that coffee will create a source map.

[Read about the flags](https://coffeescript.org/#cli).

`coffee -wm -o ./ ./server.coffee`

`coffee -wm -o ./coffee/compiled ./coffee`

`coffee -wm -o ./static/coffee/compiled ./static/coffee`

### Run

##### Run with [Nodemon](https://nodemon.io)

`nodemon server.js`

##### Or without

`node server.js`
