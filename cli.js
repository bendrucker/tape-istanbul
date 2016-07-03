#!/usr/bin/env node

'use strict'

const meow = require('meow')
const tapeIstanbul = require('./')

const cli = meow(`
  Example
    $ browserify test.js -p tape-istanbul/plugin | tape-istanbul
  Options
    -o, --output The output file for writing JSON coverage data (default: coverage.json)
`, {
  o: 'output'
})

process.stdin
  .pipe(tapeIstanbul(cli.flags.output))
  .pipe(process.stdout)
