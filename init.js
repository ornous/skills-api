#!/usr/bin/env node

const fs = require('fs')

fs.stat('.env', (err, stat) => {
  if (err === null) {
    console.log('.env file already exists. Skipping')
    return
  }

  fs.createReadStream('.env.sample').pipe(fs.createWriteStream('.env'))
  console.log('Wrote new .env file')
})
