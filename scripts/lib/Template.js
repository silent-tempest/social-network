/**
 * This class just implements caching and include function.
 */

'use strict';

const template = require( 'peako/template' );
const { resolve, extname } = require( 'path' );
const { readFileSync } = require( 'fs' );

/**
 * @param {string} folder The views folder.
 * @param {string} layout The layout file.
 */

// const layout = new Template( 'views', 'layout' )

function Template ( folder, layout ) {
  this.folder = folder;
  this.layout = layout;
  this._cache = {};
}

Template.prototype = {

  // <% for ( let post of data.posts ) {
  //   print( this.include( 'post', post ) )
  // } %>

  include ( path, data ) {
    if ( ! extname( path = resolve( this.folder, path ) ) ) {
      path += '.tmpl';
    }

    if ( ! this._cache[ path ] ) {
      this._cache[ path ] = template( readFileSync( path, 'utf8' ) );
    } else if ( ! Template.caching ) {
      const source = readFileSync( path, 'utf8' );

      if ( this._cache[ path ].source !== source ) {
        this._cache[ path ] = template( source );
      }
    }

    return this._cache[ path ].render.call( this, data || {} );
  },

  // const user = {
  //   name: 'John'
  // }

  // const head = [
  //   layout.link( './styles/user.css' )
  // ]

  // const body = [
  //   layout.script( './scripts/user.js' )
  // ]

  // const html = layout.render( 'user', { user, head, body } )

  render ( path, data ) {
    if ( ! data ) {
      data = {};
    }

    data.content = this.include( path, data );

    return this.include( this.layout, data );
  },

  script ( src ) {
    return '<script src="' + src + '"></script>';
  },

  link ( href, rel ) {
    return '<link rel="' + ( rel || 'stylesheet' ) + '" href="' + href + '" />';
  },

  constructor: Template
};

Template.caching = false;

module.exports = Template;
