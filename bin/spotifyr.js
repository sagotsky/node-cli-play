#!/usr/bin/env node

"use strict"

require('app-module-path').addPath(__dirname + '/../lib')

var EsMenu = require('esmenu'),
  Spotifyr = require('spotifyr')

let s = new Spotifyr(EsMenu)
s.search()
