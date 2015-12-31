"use strict"

module.exports = class Spotifyr {
  constructor(menu) {
    this.spotify = require('spotify')
    this.player = require('spotify-player-bridge')
    this.menu = menu
  }

  search(term) {
    this.menu_get([], (query) => {
      this.spotify.search({type: 'track,album,artist', query: query}, (err, data) => {
        let artists = data['artists']['items'].reduce( (memo, artist) => {
          memo[artist.name] = artist.uri
          return memo
        }, {})

        //this.menu_get(artists, this.play) # we seem to lose `this`.  maybe inline function is better?
        this.menu_get(artists, (artist) => { this.play(artist) })
      })
      //console.log(data['tracks']['items'])

      // let albums_with_artists = this._albums_metadata(data['albums']['items'])
      // console.log(albums_with_artists)
      // let albums = albums_with_artists.reduce( (memo, album) => {
      //   return memo 
      // }, {})
      
      //let albums = data['albums']['items'].reduce((memo, item) => {
      //  //console.log(item)
      //  memo[item.name] = item.uri;
      //  memo[item.uri] = item.name
      //  return memo
      //}, {})

      //console.log(albums)
      //console.log(data)
    })
  }

  menu_get(list, callback) {
    (new this.menu(list)).get(callback)
  }

  play(item) {
    this.player.play(item)
  }

  // spotify search gives album names with no artist
  _albums_metadata(albums) {
    let ids = albums.map( (album) => { return album.id } );
    this.spotify.albums(ids, (err, data) => {
      console.log(data, err)
    })
  }
}
