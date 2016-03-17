"use strict";

class SpotifyPlayerBridge {
  constructor() {
    this.exec = require('bluebird').promisify(require('child_process').exec)
  }

  open_uri(id) { this._dbus('OpenUri', id) }
  next()       { this._dbus('Next') }
  previous()   { this._dbus('Previous') }
  pause()      { this._dbus('Pause') }
  play_pause() { this._dbus('PlayPause') }
  stop()       { this._dbus('Stop') }
  play()       { this._dbus('Play') } 

  metadata()   { return this._dbus_get('Metadata') }

  _dbus(method, arg) {
    let cmd = ['dbus-send',
               '--print-reply',
               '--dest=org.mpris.MediaPlayer2.spotify',
               '/org/mpris/MediaPlayer2',
               `org.mpris.MediaPlayer2.Player.${method}`,
               `${(typeof arg != 'undefined') ? arg : ''}`
              ].join(' ')
              
    return this.exec(cmd) 
  }

  // spotify's metadata isn't returning, so....
  _dbus_get(method) {
    let cmd = ['dbus-send',
               '--print-reply',
               '--session',
               '--dest=org.mpris.MediaPlayer2.spotify',
               '/org/mpris/MediaPlayer2',
               'org.freedesktop.DBus.Properties.Get', 
               "string:'org.mpris.MediaPlayer2.Player'",
               `string:'${method}'`
              ].join(' ')
    return this.exec(cmd)
  }
}

module.exports = new SpotifyPlayerBridge()
