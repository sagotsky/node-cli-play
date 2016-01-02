"use strict";

//TODO extract this into separte npm package
//require('minimist')

//constructor(list, bin = 'dmenu', dmenu = '-l 20') {
module.exports = class EsMenu {
  constructor(list, bin, dmenu_opts) {
    this.list = list || []
    this.dmenu_opts = dmenu_opts || '-l 20'
    this.bin = bin || 'dmenu'
  }

  get() {
    let execSync = require('child_process').execSync
    let dmenu = execSync(this._dmenu(), {input: this._list_items()})
    return this._result(dmenu.toString())
  }

  _dmenu() {
    return `${this.bin} ${this.dmenu_opts}`
  }

  _list_items() {
    let _list

    if (Array.isArray(this.list)) {
      _list = this.list
    } else {
      _list = Object.keys(this.list)
    }

    return _list.join("\n")
  }

  _result(value) {
    value = value.trim()
    if (Array.isArray(this.list)) {
      return value
    } else {
      return this.list[value]
    }
  }
}

// let menu = new EsMenu([1,2,3])
// let menu = new EsMenu({a: 1, b: 2, c: 3})
// console.log(menu.get())

