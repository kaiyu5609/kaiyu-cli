#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')

program.usage('<surprise>')
program.command('surprise').description('a surprise')
program.parse(process.argv)

var filePath = path.join(__dirname, '../lib/love.txt')

fs.readFile(filePath, {
    encoding: 'utf-8' 
}, function(err, data) {
    if (err) {
        console.log(err)
    } else {
        console.log(data)
    }
})