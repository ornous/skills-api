#!/usr/bin/env node

const fs = require('fs')

// TODO Ensure file isn't written if sample doesn't exist
fs.stat('.env', (err, stat) => {
  if (err === null) {
    console.log('.env file already exists. Skipping')
    return
  }

  fs.createReadStream('samples/.env').pipe(fs.createWriteStream('.env'))
  console.log('Wrote new .env file')
})

fs.stat('docker-compose.override.yml', (err, stat) => {
  if (err === null) {
    console.log('docker-compose override file already exists. Skipping')
    return
  }

  fs
    .createReadStream('samples/docker-compose.override.yml')
    .pipe(fs.createWriteStream('docker-compose.override.yml'))
  console.log('Wrote new docker-compose override file file')
})
