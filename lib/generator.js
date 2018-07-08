const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const minimatch = require('minimatch')
const path = require('path')
const fs = require('fs')
const utils = require('../lib/utils')

module.exports = function(metadata = {}, src, dest = '.', gType = 'project') {
    if (!src) {
        return Promise.reject(new Error(`无效的source: ${src}`))
    }

    return new Promise((resolve, reject) => {
        const metalsmith = Metalsmith(process.cwd())
            .metadata(metadata)
            .clean(false)
            .source(src)
            .destination(dest)

        // 判断项目模板中是否有tempaltes.ignore
        const ignoreFile = path.join(src, 'templates.ignore')

        if (fs.existsSync(ignoreFile)) {
            // 定义一个用于移除模板中被忽略文件的metalsmith插件
            metalsmith.use((files, metalsmith, done) => {
                const meta = metalsmith.metadata()
                // 先对ignore文件进行渲染，然后按行切割ignore文件的内容，拿到被忽略清单
                const ignores = Handlebars.compile(fs.readFileSync(ignoreFile).toString())(meta)
                    .split('\n').filter(item => !!item.length)

                Object.keys(files).forEach(fileName => {
                    // 移除被忽略的文件
                    ignores.forEach(ignorePattern => {
                        if (minimatch(fileName, ignorePattern)) {
                            delete files[fileName]
                        }
                    })
                })
                done()
            })
        }

        if (gType === 'project') {
            metalsmith.use((files, metalsmith, done) => {
                const meta = metalsmith.metadata()
                // console.log('files', files)
                // console.log('meta', meta)
    
                Object.keys(files).forEach(fileName => {
                    const t = files[fileName].contents.toString()
                    files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
                })
                done()
            }).build(err => {
                err ? reject(err) : resolve()
            })
        } else if (gType === 'module') {
            metalsmith.use((files, metalsmith, done) => {
                const meta = metalsmith.metadata()
                // console.log('files', files)
                // console.log('meta', meta)
    
                Object.keys(files).forEach(fileName => {
                    const t = files[fileName].contents.toString()
    
                    var lastIndex = fileName.lastIndexOf('/')
                    var fileNameUrl
    
                    if (lastIndex >= 0) {
                        fileNameUrl = fileName.substring(0, lastIndex + 1);
                    } 
    
                    if (fileNameUrl) {
                        var moduleName = utils.firstUpperCase(meta.name)
                        var newFileName = [fileNameUrl, moduleName, '.js'].join('')
                        files[newFileName] = {
                            contents: new Buffer(Handlebars.compile(t)(meta))
                        }
                        delete files[fileName]
                    } else {
                        files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
                    }
                })
                done()
            }).build(err => {
                err ? reject(err) : resolve()
            })
        }

    })
}
