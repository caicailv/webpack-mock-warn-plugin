const { red, cyan, yellow } = require('colorette')
const wanrns = []
module.exports = class WebpackMockWarnPlugin {
  constructor(options = {}) {
    this.mockReg = options.mockReg
    this.mockFlag = options.mockFlag || 'mock'
  }
  apply(compiler) {
    compiler.hooks.afterCompile.tap('afcompile', this.throwWarn)
    compiler.hooks.compilation.tap('mockWarn', (compilation) => {
      compilation.hooks.afterChunks.tap('af', (chunks) => {
        this.testChunk(chunks)
      })
    })
  }
  testChunk(chunks){
    chunks.forEach((chunk) => {
      const reg =
        this.mockReg ||
        new RegExp(`(\/\*)\s*${this.mockFlag}|\/\/ *${this.mockFlag}`, 'g')
      const chunkCode = chunk.entryModule._source._value
      // 先生成行数数组.每个元素的index表示当前行数,每个元素的index表示所在行,内容是所在的index
      const rows = [0]
      for (let i = 0; i < chunkCode.length; i++) {
        if (chunkCode[i] === '\n') rows.push(i)
      }
      var regExec = null
      while ((regExec = reg.exec(chunkCode)) !== null) {
        // 若匹配到mock,则取出行数/上一行,下三行之内的content
        if (regExec[0]) {
          // 循环遍历所在行数
          for (let index in rows) {
            if (rows[index] >= regExec.index) {
              //在该行 取出内容
              let content = ''
              let contentWrap = 5
              let endIndex = chunkCode.length
              let startIndex = 0
              for (let i = regExec.index; i >= 0; i--) {
                if (chunkCode[i] === '\n') {
                  startIndex = i
                  break
                }
              }
              for (let i = regExec.index; i <= chunkCode.length - 1; i++) {
                if (contentWrap === 0) {
                  endIndex = i
                  break
                }
                if (chunkCode[i] === '\n') {
                  contentWrap--
                }
              }
              content = chunkCode.slice(startIndex, endIndex)
              wanrns.push({
                row: index || 1,
                path: chunk.entryModule._source._name,
                content,
              })
              break
            }
          }
        }
      }
    })
  }
  throwWarn(){
    if (wanrns.length !== 0) {
      let errorStr = `${red(
        `检测到存在${wanrns.length}处mock数据,请删除后再次尝试操作:
        如果你想使用自定义捕获mock标记,请配置 mockFlag , 也可以配置 mockReg 自定义捕获mock正则
        `
      )}\n`
      for (let el of wanrns) {
        errorStr += yellow(
          `path: ${el.path}\nrow: ${el.row}\ncontent: ${cyan(el.content)}\n\n`
        )       
      }
      console.error(red(errorStr))
      process.exit(1);
    }
  }
}
