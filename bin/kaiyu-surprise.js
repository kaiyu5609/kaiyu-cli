#!/usr/bin/env node

const program = require('commander')
const imaging = require('imaging')

program.usage('<surprise>')
program.command('surprise').description('a surprise')
program.parse(process.argv)

imaging.draw('./../lib/image/love.png', {
    width: 90, char: '@'
}, function(resp, status) {
    if (status == 'success') {
        console.log(resp)
    }
})