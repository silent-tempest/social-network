# Social Network

A social network written without [Express](http://expressjs.com/).

### Starting from Scratch

##### Install Dependencies

`$ npm i`

Install [underscore](http://underscorejs.org/) for [templating](http://underscorejs.org/#template).

Install [mime](https://github.com/broofa/node-mime) to determine the MIME type of a static file.

Install [peako](https://github.com/silent-tempest/Peako/tree/dev) to use ajax on a client.

Install [qs](https://www.npmjs.com/package/qs) to parse URL query or request's urlencoded body.

##### Install [CoffeeScript](https://coffeescript.org)

`$ npm i -g coffeescript`

### Compile Static [CoffeeScript](https://coffeescript.org)

`$ make`

### Run

`coffee server.coffee`

### NOTES

The `Template`, `File`, and `FileManager` classes use caching, so, be careful. Files to be cached: in the `views/`, in the `data/`
