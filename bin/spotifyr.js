#!/usr/bin/env node

"use strict"

require('app-module-path').addPath(__dirname + '/../lib')

var EsMenu = require('esmenu'),
  Spotifyr = require('spotifyr')

var client = new Spotifyr(EsMenu)

var argv = require('yargs')
  .usage('spotifyr <command>')
  .require(1)
  .strict(true)

  .command('next'       , 'Play next song'     , player_cmd)
  .command('previous'   , 'Play previous song' , player_cmd)
  .command('play_pause' , 'Toggle play/pause'  , player_cmd)
  .command('pause'      , 'Pause playback'     , player_cmd)
  .command('stop'       , 'Stop playback'      , player_cmd)
  .command('play'       , 'Play'               , player_cmd)

  .command('status'     , 'Show current song'  , status_cmd)

  .command('search', 'Search spotify for any type of media and play it.', search_cmd)
  .command('artist', 'Arist search', search_cmd)
  .command('album', 'Album search', search_cmd)
  .command('track', 'Track search', search_cmd)

  .argv

function status_cmd(yargs) {
  yargs.option('f', {
    alias: 'fields', 
    describe: 'specify field(s) to show', 
    requiresArg: true,
  }).usage("Status - Get currently playing song's metadata")

  let fields = yargs.argv['fields']
  client.status(fields ? fields.split(',') : undefined)
}

function player_cmd(yargs) {
  yargs.option('v', {
    alias: 'verbose', 
    describe: 'show status after track change', 
    default: false,
    requiresArg: false,
    boolean: true
  })
    .usage('Player commands - next, previous, play_pause, play, pause, stop - control playback of spotify client.')

  let args = yargs.argv
  let cmd = args._[0]

  client[cmd]()

  if (args.verbose) {
    client.status()
  }
}

// does acquiring a search term from dmenu fit in bin in lib?
function search_cmd(yargs) {
  yargs.option('q', {
    alias: 'query', 
    describe: 'Query string for search commands.  If blank, you will be prompted.', 
    string: true,
    //requiresArg: true,
    default: 'Rush' //todo get something from esmenu
  })
    .usage('Search spotify for albums, artists, tracks, etc and play them.  Use dmenu to search and select or use -q to specify a query string.')

  let args = yargs.argv
  let cmd = args._[0]
  let types = []
  switch (cmd) {
    case 'artist':
      types = ['artist']; 
      break;
    case 'album':
      types = ['album'];
      break;
    default:
      types = ['artist', 'album', 'track']
  }

  client['search'](args['query'], types)
  // console.log('TODO: all search functions')

}
