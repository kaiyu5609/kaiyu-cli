#!/usr/bin/env node

const program = require('commander')
const package = require('../package.json')

program.version(package.version, '-v, --version')
.usage('<command> [项目名称]')
.command('init', '创建新项目')
.command('module', '创建模块')

program.parse(process.argv)