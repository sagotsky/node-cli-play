#!/usr/bin/env node

"use strict"

require('app-module-path').addPath(__dirname + '/../lib')

var EsMenu = require('esmenu'),
  Spotifyr = require('spotifyr')

//omg we need better arg parsing
let s = new Spotifyr(EsMenu)
let arg = process.argv[2]

if (['next', 'previous', 'play_pause', 'pause', 'stop', 'play'].indexOf(arg) > -1) {
  s[arg]()
} else {
  s.search()
}
