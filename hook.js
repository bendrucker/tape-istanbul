'use strict'

const tape = require('tape')
const window = require('global/window')
const separator = require('./separator')

tape.onFinish(function () {
  console.log(separator)
  console.log(JSON.stringify(window.__coverage__))
})
