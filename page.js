var HtmlWebpackPlugin = require("html-webpack-plugin")
const getEntry = require("./getEntry")
var pages = Object.keys(getEntry("src/*.html", "src/"))

module.exports = configEntry => {
  let pagesArr = []
  pages.forEach(function(pathname) {
    var conf = {
      filename: "./" + pathname + ".html", //生成的html存放路径，相对于path
      template: "src/" + pathname + ".html", //html模板路径
      inject: false //js插入的位置，true/'head'/'body'/false
      /*
       * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
       * 如在html标签属性上使用{{...}}表达式，所以很多情况下并不需要在此配置压缩项，
       * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
       * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
       */
      // minify: { //压缩HTML文件
      //  removeComments: true, //移除HTML中的注释
      //  collapseWhitespace: false //删除空白符与换行符
      // }
    }
    if (pathname in configEntry) {
    //   conf.favicon = "src/imgs/favicon.ico"
      conf.inject = "body"
      conf.chunks = ["common", pathname]
      conf.hash = false //不插入js
    }
    pagesArr.push(new HtmlWebpackPlugin(conf))
    //   config.plugins.push(new HtmlWebpackPlugin(conf))
  })
  return pagesArr
}
