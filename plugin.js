'use strict'

const path = require('path')

module.exports = tapeIstanbulify

function tapeIstanbulify (browserify, opts) {
  opts = opts || {}
  browserify
    .add(path.resolve(__dirname, 'hook.js'))
    .transform('browserify-istanbul', opts)
}
