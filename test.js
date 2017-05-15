'use strict'

const test = require('tape')
const path = require('path')
const child = require('child_process')
const browserify = require('browserify')
const duplexify = require('duplexify')
const concat = require('concat-stream')
const fs = require('fs')
const tapeIstanbul = require('./')

const tapOutput = fs.readFileSync('fixture-output.txt', 'utf8')

test('api', function (t) {
  t.plan(4)

  browserify()
    .add(path.resolve(__dirname, 'fixture-test.js'))
    .plugin(path.resolve(__dirname, 'plugin.js'))
    .bundle()
    .pipe(node())
    .pipe(tapeIstanbul().on('end', function () {
      t.ok(true, 'end was emitted')
    }))
    .pipe(concat(function (output) {
      t.equal(output.toString(), tapOutput, 'passes tap output through')
      const coverageFile = fs.readFileSync('coverage.json')
      t.doesNotThrow(function () {
        t.ok(JSON.parse(coverageFile), 'generates a coverage json file')
        fs.unlinkSync('coverage.json')
      })
    }))
})

test('cli', function (t) {
  t.plan(3)

  browserify()
    .add(path.resolve(__dirname, 'fixture-test.js'))
    .plugin(path.resolve(__dirname, 'plugin.js'))
    .bundle()
    .pipe(node())
    .pipe(cli())
    .pipe(concat(function (output) {
      t.equal(output.toString(), tapOutput, 'passes tap output through')
      const coverageFile = fs.readFileSync('coverage.json')
      t.doesNotThrow(function () {
        t.ok(JSON.parse(coverageFile), 'generates a coverage json file')
        fs.unlinkSync('coverage.json')
      })
    }))
})

function node () {
  return duplex(child.spawn('node'))
}

function cli () {
  return duplex(child.spawn('node', [path.resolve(__dirname, 'cli.js')]))
}

function duplex (spawned) {
  return duplexify(spawned.stdin, spawned.stdout)
}
