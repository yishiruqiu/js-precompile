# js-precompile

一个web前端开发预编译的webpack loader。   

### 用法
插件提供了`IFDEBUG` `IFTRUE` `#define` 预编译指令。用法是：在js代码的任意地方以`/*IFDEBUG`或`/*IFTRUE_xxx`开头，以`FIDEBUG*/`或`FITRUE_xxx*/`结尾，中间是被包裹的js代码。`xxx`是在webpack中指定的options条件属性名，比如`myFlag`。

- 模式1 - 全注释:   
因为采用了js注释的形式，故即使不使用js-conditional-compile-loader，也不影响js代码的运行逻辑。
````js
    /*IFDEBUG Any js here FIDEBUG*/
````

````js
/* IFTRUE_yourFlagName ...js code... FITRUE_yourFlagName */
````
- 模式2（首+尾）：   
这种模式下，可使用eslint校验你的代码。
````js
/* IFDEBUG */
var anyJsHere = 'Any js here'
/*FIDEBUG */
````

````js
/* IFTRUE_yourFlagName*/ 
function anyJsHere(){
}
/*FITRUE_yourFlagName */
````

----
### 由源码输出的结果
源码：
````js
/* IFTRUE_forAlibaba */
var aliCode = require('./ali/alibaba-business.js')
aliCode.doSomething()
/* FITRUE_forAlibaba */

$state.go('win', {dir: menu.winId /*IFDEBUG , reload: true FIDEBUG*/})
````
当options为`{isDebug: true, forAlibaba: true}`时，构建后输出的内容:
````js
var aliCode = require('./ali/alibaba-business.js')
aliCode.doSomething()

$state.go('win', {dir: menu.winId, reload: true })
````

当options为`{isDebug: false, forAlibaba: false}`时，构建后输出的内容:
````js
$state.go('win', {dir: menu.winId})
````
----


### vue.config.js配置
这样修改vue.config.js配置:     

````js
chainWebpack: config => {
    
    const compileOptions = {
        Technician: process.env.VUE_APP_TYPE === 'technician',
        Single: process.env.VUE_APP_TYPE === 'single',
        Composite: process.env.VUE_APP_TYPE === 'composite',
    }
    config.module
    .rule('vue')
        .use('js-precompile')
        .loader('js-precompile')
        .options(compileOptions).end()
    config.module
    .rule('js')
        .use('js-precompile')
        .loader('js-precompile')
        .options(compileOptions).end()
}
````
### options
- isDebug: {bool = [process.env.NODE_ENV === 'development']}

如果isDebug === false，所有`/\*IFDEBUG` 和 `FIDEBUG\*/`之间的代码都会被移除。 其他情况，这些代码则会被保留。

- 任意属性名：{bool}
如果 value === false，所有`/\* IFTRUE_属性名` 和 `FITRUE_属性名 \*/`之间的代码都会被移除。 其他情况，这些代码则会被保留。

	
## 用法举例

* 1:
````js
var tx = "This is app /* IFTRUE_Ali of debug FITRUE_Ali */ here";
````

* 2:
````js
/*IFDEBUG
alert('Hi~');
FIDEBUG*/
````

* 3
```js
Vue.component('debugInfo', {
    template: ''
    /* IFDEBUG
        + '<pre style="font-size:13px;font-family:\'Courier\',\'Courier New\';z-index:9999;line-height: 1.1;position: fixed;top:0;right:0; pointer-events: none">{{JSON.stringify($attrs.info || "", null, 4).replace(/"(\\w+)":/g, "$1:")}}</pre>'
    FIDEBUG */
    ,
    watch: {
      /* IFTRUE_myFlag */
      curRule (v){
          this.ruleData = v
      },
      /*FITRUE_myFlag */
    },
});
```
