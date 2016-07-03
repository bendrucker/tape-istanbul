'use strict'

const pumpify = require('pumpify')
const split = require('split2')
const through = require('through2')
const separator = require('./separator')

module.exports = coverageParser

function coverageParser (callback) {
  const stream = pumpify(
    split(),
    through(write)
  )

  var previous = ''

  return stream

  function write (line, enc, callback) {
    if (isSeparator(previous)) {
      stream.emit('coverage', JSON.parse(line))
      return callback()
    }

    if (!isSeparator(line)) this.push(line + '\n')
    previous = line
    callback()
  }
}

function isSeparator (line) {
  return !line.indexOf(separator)
}
