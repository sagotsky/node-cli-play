#!/usr/bin/env node

"use strict"

require('app-module-path').addPath(__dirname + '/../lib')

var EsMenu = require('esmenu'),
  Spotifyr = require('spotifyr')

function help() {
  console.log('#TODO: write some help message.  hopefully yargs can provide them')
}

let argv = require('yargs').argv
let cmd = argv._[0]
let client = new Spotifyr(EsMenu)
// console.log(argv)
//omg we need better arg parsing

switch (cmd) {
  case 'next':
  case 'previous':
  case 'play_pause':
  case 'pause':
  case 'stop':
  case 'play':
  case 'metadata':
    client[cmd]()
    break

  case 'search':
    client.search()
    break

  default:
    help()
    break
}
