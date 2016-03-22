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

/***************************************
 * Let's take a stab at figuring out what the cli syntax should look like
 
 spotifyr
 # no idea what's the default

 spotifyr next|previous|pause
 # these seem fine.  should they be noisy?  maybe that requires a flag.
 # metadata -> status.  

 spotifyr search
 spotifyr search album
 spotifyr search artist
 # dmenu search for anything or a particular thing

 spotifyr search rush
 spotifyr search album rush
 spotifyr search artist rush
 # ugh, do i need flags
 
 spotifyr search rush -> search all the things
 spotifyr album rush -> album search
 # maybe search's arg is the search term and album/artist/etc are more specific searches.  should search be find or is that rubyish?
 # so far so goood....

 # how about radio/related
 # starred?
 # text search is fine, but prepop lists are nice too
 ## artist/myartists

 spotifyr my/starred
 spotifyr myartists/my_artists
 # lists all starred vs artists starred
 
 spotifyr related_artists
 spotifyr artists_albums 
 # searches off of current artist selection


 # open questions
 enqueueing instead of playing
 radio station/genre search


***************************************/

/*******************************

let's try some cmd routing

let cmd = require('clint').cmd # cli node thing

cmd.option('q', 'query', 'Provide a search query instead of using dmenu')
cmd.option('v', 'verbose', 'Show state after each command')

cmd.default?
cmd.handler(SpotifySearcher)
  .desc('search', 'Search all of spotify')
  .desc('album')
  .desc('artist')

  .desc('related_artists') # could take a -q I guess

cmd.handler(SpotifyPlayer)
  .desc('play')
  .desc('next')
  .desc('previous')

# -h is built in?

cmd.run(argv)


# cmd.handler register a class to handle certain commands.
# when a command that it's registered to handle is run, initialize class with options, then run the handle method

how would sub commands look?

git_cmd.sub(Stash)
is stash something special?

how about....
git_cmd.sub('stash', function(sub) {
  sub.handler(Stash)
    .desc('list')
}

*******************************/
