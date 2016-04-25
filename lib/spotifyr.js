"use strict"

module.exports = class Spotifyr {
  constructor(menu) {
    this.spotify = require('spotify')
    this.player = require('spotify-player-bridge')
    this.menu = menu
  }

  // todo: limit/offset
  search(query, types) {
    //let query = this.menu_get([]) //i guess this is the defualt list?
    
    console.log(query, types)
    this.spotify.search({type: types.join(','), query: query}, (err, data) => {
      let artists = {}, tracks = {}, albums = {}
      //would some sort of playlist object be better than navigating several slightly different hashes?  
      //loop over types in data, then items in type, running "add_`${type}`

      if (types.indexOf('artist') != -1) {
        artists = data['artists']['items'].reduce( (memo, artist) => {
          memo[artist.name] = artist.uri
          return memo
        }, {})
      }

      if (types.indexOf('track') != -1) {
        tracks = data['tracks']['items'].reduce( (memo, track) => {
          let name = `[${track.artists[0]['name']} - ${track.album.name}] ${track.name}`
          memo[name] = track.uri 
          return memo
        }, {});
      }

      if (types.indexOf('album') != -1) {
        albums = data['albums']['items'].reduce( (memo, album) => {
          let name = `[${album.id}] ${album.name}` //todo.  get artist.
          memo[name] = album.uri
          return memo
        }, {});
      }

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

  //how about this.player[cmd]()
  //enumerating over these simple delegated commands seems useful...
  next()       { this.player.next() }
  previous()   { this.player.previous() }
  pause()      { this.player.pause() }
  stop()       { this.player.stop() }
  play()       { this.player.play() }
  play_pause() { this.player.play_pause() }

  //todo: args to request particular metadata by name
  status(fields)   { 
    fields = fields || ['album', 'artist', 'title', 'trackNumber', 'url', 'artUrl']
    let promise = this.player.metadata()
    promise.then((data) => {
      let parsed = this._parse_dbus_reply(data);
      for (var field of fields) {
        console.log(field, '-', parsed[field])
      }
      // data = data.split("\n").map( (line) => {
      //   return line.replace(/\w+:/, '')
      // })
      // console.log(data.join("\n"))
    }, (fail) => {console.log(fail)})
  }

  //parses dbus-send --print-reply's custom formatting
  _parse_dbus_reply(dbus_reply_string) {
    let entries = (dbus_reply_string.split(')'));

    let tokenized_entries = entries.map( (entry) => { 
      return entry.split('"'); 
    })

    let value_tokens = tokenized_entries.map( (entry) => {
      return [ entry[1], entry[3] ];
    });

    let result = value_tokens.reduce( (hash, tokens) => {
      if (tokens[0] != undefined) {
        hash[ tokens[0].split(':')[1] ] = tokens[1]
      }
      return hash
    }, {});

    return result
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

