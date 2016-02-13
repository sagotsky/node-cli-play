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

  .option('v', {
    alias: 'verbose', 
    describe: 'show status after track change', 
    default: false,
    requiresArg: false,
    type: 'boolean'
  })

  .option('q', {
    alias: 'query', 
    describe: 'Query string for search commands.  If blank, you will be prompted.', 
    type: 'string',
    requiresArg: true,
    default: ''
  })

  .command('next'       , 'Play next song'     , player_cmd)
  .command('previous'   , 'Play previous song' , player_cmd)
  .command('play_pause' , 'Toggle play/pause'  , player_cmd)
  .command('pause'      , 'Pause playback'     , player_cmd)
  .command('stop'       , 'Stop playback'      , player_cmd)
  .command('play'       , 'Play'               , player_cmd)
  .command('status'     , 'Show current song'  , player_cmd)

  .command('search', 'Search spotify for any type of media and play it.', (yargs) => {
    search_cmd(yargs)
  })

  .argv

function player_cmd(yargs) {
  //init client with special opts here?
  let args = yargs.argv
  let cmd = args._[0]
  client[cmd]()
  console.log(args)
  if (args['verbose']) {
    client.metadata
  }
}

function search_cmd(yargs) {
  console.log(yargs.argv)
}
console.log(argv)
