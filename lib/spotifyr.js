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
      this.open_uri(this.menu_get(all))
    })
  }

  menu_get(list) {
    let bin = 'dmenu'
    let dmenu_opts = "-l 20 -p spotify -sb '#fff' -nb '#fff' -nf '#2c8' -sf '#222' "
    return (new this.menu(list, bin, dmenu_opts)).get()
  }

  open_uri(item) {
    this.player.open_uri(item)
  }

  next()       { this.player.next() }
  previous()   { this.player.previous() }
  pause()      { this.player.pause() }
  stop()       { this.player.stop() }
  play()       { this.player.play() }
  play_pause() { this.player.play_pause() }

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
