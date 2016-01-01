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

        let artists_tracks = data['tracks']['items'].reduce( (memo, track) => {
          let name = `[${track.artists[0]['name']} - ${track.album.name}] ${track.name}`
          memo[name] = track.uri 
          return memo
        }, artists);

        let artists_tracks_albums = data['albums']['items'].reduce( (memo, album) => {
          let name = `[${album.id}] ${album.name}` //todo.  get artist.
          memo[name] = album.uri
          return memo
        }, artists_tracks);

        this.menu_get(artists_tracks_albums, (item) => { this.play(item) })
      })
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
