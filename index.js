'use strict'

const fs = require('fs')
const parse = require('./parse')

module.exports = tapeIstanbul

function tapeIstanbul (output) {
  return parse().on('coverage', function (coverage) {
    fs.writeFile(output || 'coverage.json', JSON.stringify(coverage, null, 2))
  })
}
