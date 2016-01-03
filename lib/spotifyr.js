"use strict"

module.exports = class Spotifyr {
  constructor(menu) {
    this.spotify = require('spotify')
    this.player = require('spotify-player-bridge')
    this.menu = menu
  }

  search(term) {
    let query = this.menu_get([])

    this.spotify.search({type: 'track,album,artist', query: query}, (err, data) => {
      let artists = data['artists']['items'].reduce( (memo, artist) => {
        memo[artist.name] = artist.uri
        return memo
      }, {})

      let tracks = data['tracks']['items'].reduce( (memo, track) => {
        let name = `[${track.artists[0]['name']} - ${track.album.name}] ${track.name}`
        memo[name] = track.uri 
        return memo
      }, {});

      let albums = data['albums']['items'].reduce( (memo, album) => {
        let name = `[${album.id}] ${album.name}` //todo.  get artist.
        memo[name] = album.uri
        return memo
      }, {});

      let all = Object.assign(artists, albums, tracks)
      this.play(this.menu_get(all))
    })
  }

  menu_get(list) {
    return (new this.menu(list)).get()
  }

  play(item) {
    this.player.play(item)
  }

  // spotify search gives album names with no artist
  //_albums_metadata(albums) {
  //  let ids = albums.map( (album) => { return album.id } );
  //  let z = this.spotify.albums(ids, (err, data) => {
  //    //console.log(data, err)
  //    return data
  //  })
  //  console.log(z)
  //}
}
