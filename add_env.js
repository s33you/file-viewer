import fs from 'fs'
let str = fs.readFileSync('./dist/server.js')

str = '#! /usr/bin/env node\n' + str
console.log('add Usr env')
fs.writeFileSync('./dist/server.js',str)