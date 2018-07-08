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

program.usage('<project-name>')
program.command('init <name>').description('init a project')
program.parse(process.argv)

// 根据输入，获取项目名称
let projectName = program.args[0]

if (!projectName) {  // project-name 必填
    // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
    program.help() 
    return
}

const list = glob.sync('*')  // 遍历当前目录
/**
 * list: [ 'bin', 'lib', 'node_modules', 'template', 'test', 'package.json' ]
 */
let rootName = path.basename(process.cwd())

/**
 * process.cwd() -> '执行命令的文件夹目录'
 * path.basename('<path>') -> '执行命令的文件夹名称'
*/

let next = undefined

if (list.length) {  // 如果当前目录不为空
    if (list.filter(name => {
        const fileName = path.resolve(process.cwd(), path.join('.'), name)
        const isDir = fs.statSync(fileName).isDirectory()
        return name.indexOf(projectName) !== -1 && isDir
    }).length !== 0) {
        console.log(logSymbols.error, chalk.red(`项目${projectName}已经存在`))
        return
    }
    next = Promise.resolve(projectName)
} else if (rootName === projectName) {
    next = inquirer.prompt([
        {
            name: 'buildInCurrent',
            message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
            type: 'confirm',
            default: true
        }
    ]).then(answer => {
        return Promise.resolve(answer.buildInCurrent ? '.' : projectName)
    })
} else {
    next = Promise.resolve(projectName)
}

next && init()

function init () {
    // 预留，处理子命令
    // console.log(path.resolve(process.cwd(), path.join('.'), rootName))

    var template = path.join(__dirname, '../template/project')

    next.then(projectRoot => {
        console.log(logSymbols.info, 'projectRoot', projectRoot)

        // 模拟下载模板效果
        return new Promise((resolve, reject) => {
            if (projectRoot != '.') {
                const spinner = ora(`正在下载项目模板，源地址：${template}`)
                
                spinner.start()
                setTimeout(function() {
                    spinner.succeed()
                    resolve(projectRoot)
                }, 2000)
            } else {
                resolve(projectRoot)
            }    
        })
    }).then(projectRoot => {
        console.log(logSymbols.success, chalk.green('模板复制成功!'))
        console.log(chalk.green('cd ' + projectRoot + '\nnpm install\nnpm run dev'))

        return {
            root: projectRoot,
            name: projectRoot == '.' ? rootName : projectRoot
        }
    }).then(context => {
        return inquirer.prompt([
            {
                name: 'projectName',
                message: '项目的名称',
                default: context.name
            }, {
                name: 'projectVersion',
                message: '项目的版本号',
                default: '1.0.0'
            }, {
                name: 'projectDescription',
                message: '项目的简介',
                default: `A project named ${context.name}`
            }, {
                name: 'projectAuthor',
                message: '项目的作者',
                default: 'omit'
            }
        ]).then(answers => {
            /**
             * answers:
                {    
                    projectName: 'test',
                    projectVersion: '1.0.0',
                    projectDescription: 'A project named test',
                    projectAuthor: 'omit' 
                }
            */
            return {
                root: context.root,
                name: context.name,
                metadata: {
                    projectName: answers.projectName,
                    projectVersion: answers.projectVersion,
                    projectDescription: answers.projectDescription,
                    projectAuthor: answers.projectAuthor,
                    supportUiVersion: '1.0.1'
                }
            }
        })
    }).then(context => {
        return generator(context, template, context.root, 'project')
    }).then(context => {
        console.log(logSymbols.success, chalk.green('创建成功!'))
    }).catch(err => {
        console.error(logSymbols.error, chalk.red(`创建失败：${err.message}`))
    })

   
}