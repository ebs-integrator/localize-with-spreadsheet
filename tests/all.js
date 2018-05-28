#!/usr/bin/env node

try {
  var reporter = require('nodeunit').reporters.default
} catch (e) {
  console.log("Cannot find nodeunit module.")
  console.log("You can download submodules for this project by doing:")
  console.log("")
  console.log("    git submodule init")
  console.log("    git submodule update")
  console.log("")

  process.exit()
}

reporter.run([
  './tests/AndroidTransformerTests.js',
  './tests/iOSTransformerTests.js',
  './tests/LineTests.js',
  './tests/GSReaderTests.js',
  './tests/WriterTests.js'
])
