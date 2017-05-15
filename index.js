'use strict'

const fs = require('fs')
const pumpify = require('pumpify')
const promiseify = require('pify')
const through = require('through2')
const parse = require('./parse')

module.exports = tapeIstanbul

function tapeIstanbul (output) {
  // Create a pumpify pipeline populated in the scope below
  const pause = pumpify()

  // Use a promise to track the write of the coverage file
  // Only end the stream when it resolves
  // Promises are a decent way to accomplish this without much code
  const p = new Promise(function (resolve, reject) {
    pause.setPipeline(
      parse().on('coverage', writeFile),
      through(passThrough, flush)
    )

    function writeFile (coverage) {
      promiseify(fs.writeFile)(output || 'coverage.json', JSON.stringify(coverage, null, 2))
        .then(function (results) {
          pause.emit('end')
          resolve(results)
        })
        .catch(function (err) {
          pause.emit('error', err)
          reject(err)
        })
    }
  })

  return pause

  function flush (callback) {
    p.then(callback).catch((err) => callback(err))
  }
}

function passThrough (chunk, enc, callback) {
  callback(null, chunk)
}
