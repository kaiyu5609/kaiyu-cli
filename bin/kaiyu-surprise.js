#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')

program.usage('<surprise>')
program.command('surprise').description('a surprise')
program.parse(process.argv)

fs.readFile('../lib/love.txt', { 
    encoding: 'utf-8' 
}, function(err, data) {
    if (err) {
        console.log(err)
    } else {
        console.log(data)
    }
})