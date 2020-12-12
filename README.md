# mock-warn

打包时,检测 mock 数据抛出警告

## 使用方式

```js
//webpack.config.js
// 使用插件
const WebpackMocWarnkPlugin = require('webpack-mock-warn')
module.exports = {
  // ...
  plugins: [new WebpackMocWarnkPlugin()],
}
```

## params

#### mockFlag: string;

default: `mock`

> 自定义 flag 字符串

#### mockReg: regexp;

default:

```js
new RegExp(`(\/\*)\s*${this.mockFlag}|\/\/ *${this.mockFlag}`, 'g')
```

> 自定义正则表达式

```js
//webpack.config.js
const WebpackMocWarnkPlugin = require('webpack-mock-warn')
module.exports = {
  // ...
  plugins: [
    new WebpackMocWarnkPlugin({
      mockReg: new RegExp(
        `(\/\*)\s*ggg|\/\/ *ggg`,
        'g'
      ),
    }),
    // 或者
    new WebpackMocWarnkPlugin({
     mockFlag:'ggg'
    }),
  ],
}
```
若设置了 `mockReg` 则 `mockFlag` 不生效