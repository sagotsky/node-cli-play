"use strict";

class SpotifyPlayerBridge {
  constructor() {
    this.exec = require('child_process').exec
  }

  play(id) {
    this._dbus('OpenUri', id)
  }

  _dbus(method, arg) {
    let cmd = `qdbus org.mpris.MediaPlayer2.spotify / org.freedesktop.MediaPlayer2.${method} ${arg}`
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
