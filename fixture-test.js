'use strict'

const test = require('tape')
const fixture = require('./fixture')

test('test fixture', function (t) {
  t.equal(fixture(true), 1)
  t.equal(fixture(), 2)
  t.end()
})
