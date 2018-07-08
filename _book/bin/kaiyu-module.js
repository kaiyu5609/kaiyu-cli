#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const inquirer = require('inquirer')
const ora = require('ora')
const generator = require('../lib/generator')
const utils = require('../lib/utils')

program.usage('<module-name>')
program.command('generate <name>').description('generate a module')
program.parse(process.argv)

let moduleName = program.args[0]

if (!moduleName) {
    program.help()
    return
}

const list = glob.sync('*')  // 遍历当前目录
/**
 * list: [ 'bin', 'lib', 'node_modules', 'template', 'test', 'index.js', 'package.json' ]
 */
let rootName = path.basename(process.cwd())

/**
 * process.cwd() -> '/Volumes/Seagate/HBuilder projects/kaiyu-cli'
 * path.basename('/Volumes/Seagate/HBuilder projects/kaiyu-cli') -> 'kaiyu-cli'
*/

let next = undefined

if (list.length) {  // 如果当前目录不为空
    if (list.filter(name => {
        const fileName = path.resolve(process.cwd(), path.join('.'), name)
        const isDir = fs.statSync(fileName).isDirectory()
        return name.indexOf(moduleName) !== -1 && isDir
    }).length !== 0) {
        console.log(logSymbols.error, chalk.red(`项目${moduleName}已经存在`))
        return
    }
    next = Promise.resolve(moduleName)
} else if (rootName === moduleName) {
    console.log(logSymbols.error, chalk.red(`当前目录为空，且模块名称和模块根目录文件夹名称相同了`))
    return
} else {
    next = Promise.resolve(moduleName)
}

next && generate()

function generate() {
    // 预留，处理子命令
    // console.log(path.resolve(process.cwd(), path.join('.'), rootName))
    // /Volumes/Seagate/HBuilder projects/kaiyu-cli/test/test

    var template = path.join(__dirname, '../template/module')

    next.then(moduleRoot => {
        console.log(logSymbols.info, 'moduleRoot', moduleRoot)

        console.log(logSymbols.success, chalk.green('模板复制成功!'))

        return {
            root: moduleRoot,
            name: moduleRoot == '.' ? rootName : moduleRoot
        }
    }).then(context => {
        return inquirer.prompt([
            {
                name: 'moduleName',
                message: '模块的名称',
                default: context.name
            }
        ]).then(answers => {
            /**
             * answers:
                {    
                    moduleName: 'test',
                }
            */
            return {
                root: context.root,
                name: context.name,
                metadata: {
                    moduleName: answers.moduleName,
                    ModuleName: utils.firstUpperCase(answers.moduleName)
                }
            }
        })
    }).then(context => {
        return generator(context, template, context.root, 'module')
    }).then(context => {
        console.log(logSymbols.success, chalk.green('创建成功!'))
    }).catch(err => {
        console.error(logSymbols.error, chalk.red(`创建失败：${err.message}`))
    })
}