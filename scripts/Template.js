'use strict';

var template = require( 'peako/template' ),
    path     = require( 'path' ),
    fs       = require( 'fs' );

/**
 * @param {string} folder The views folder.
 * @param {string} layout The layout file.
 */

// var layout = new Template( 'views', 'layout' );

function Template ( folder, layout ) {
  this.folder = folder;
  this.layout = layout;
  this._cache = {};
}

Template.prototype = {

  // <% for ( let post of data.posts ) {
  //   print( this.include( 'post', post ) );
  // } %>

  include: function include ( url, data ) {

    if ( ! data ) {
      data = {};
    }

    url = path.join( this.folder, url ) + '.tmpl';

    if ( ! this._cache[ url ] ) {

      this._cache[ url ] = template( fs.readFileSync( url, 'utf8' ) );

    } else if ( ! Template.caching ) {

      var source = fs.readFileSync( url, 'utf8' );

      if ( this._cache[ url ].source !== source ) {
        this._cache[ url ] = template( source );
      }

    }

    return this._cache[ url ].render.call( this, data );

  },

  // const data = {
  //   name: 'John'
  // }

  // const head = [
  //   layout.link( './styles/user.css' )
  // ]

  // const body = [
  //   layout.script( './scripts/user.js' )
  // ]

  // const html = layout.render( 'user', data, head, body )

  render: function render ( url, data, head, body ) {

    if ( ! data ) {
      data = {};
    }

    data.content = this.include( url, data );

    if ( head ) {
      data.head = head;
    }

    if ( body ) {
      data.body = body;
    }

    return this.include( this.layout, data );

  },

  script: function script ( src ) {
    return '<script src="' + src + '"></script>';
  },

  link: function link ( href, rel ) {
    return '<link rel="' + ( rel || 'stylesheet' ) + '" href="' + href + '" />';
  },

  constructor: Template

};

Template.caching = false;

module.exports = Template;
