"use strict";

class SpotifyPlayerBridge {
  //http://specifications.freedesktop.org/mpris-spec/latest/Player_Interface.html
  constructor() {
    this.exec = require('child_process').exec
  }

  open_uri(id) { this._dbus('OpenUri', id) }
  next()       { this._dbus('Next') }
  previous()   { this._dbus('Previous') }
  pause()      { this._dbus('Pause') }
  play_pause() { this._dbus('PlayPause') }
  stop()       { this._dbus('Stop') }
  play()       { this._dbus('Play') } // spotify client ignores this.  bad spotify client.

  _dbus(method, arg) {
    let cmd = `qdbus org.mpris.MediaPlayer2.spotify / org.freedesktop.MediaPlayer2.${method} ${(typeof arg != 'undefined') ? arg : ''}`
    this.exec(cmd)
  }
}

module.exports = new SpotifyPlayerBridge()
//
// TODO: find a dbus client in node and translate
//module.exports = 
// class SpotifyDbusClient {
//   constructor() {
//     this.dbus = require('dbus-native')
//     this.connection = this.dbus.createConnection()
//   }

//   _message() {
//     this.connection.message({
//       path: '/',
//       destination: 'org.mpris.MediaPlayer2.spotify',
//       'interface': 'org.freedesktop.MediaPlayer2',
//       member: 'OpenUri',
//       type: this.dbus.messageType.methodCall,
//       body: 'spotify:album:4m2880jivSbbyEGAKfITCa'
//     })
//   }
// }

// let c = new SpotifyDbusClient()
// console.log(c._message())
