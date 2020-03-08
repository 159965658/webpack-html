const path = require("path")
const pagesArr = require("./page.js")
const getEntry = require("./getEntry")
const webpack = require("webpack")
var HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
/*
extract-text-webpack-plugin插件，
有了它就可以将你的样式提取到单独的css文件里， 
 */
// const ExtractTextPlugin = require("extract-text-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const copyWebpackPlugin = require("copy-webpack-plugin")
const entries = getEntry("src/*.js", "src/")

const chunks = Object.keys(entries)

console.log(entries, chunks)
module.exports = {
  mode: "development",
  entry: entries,
  // {
  //   ...chunks.map(page => {
  //     var filename = page.lastIndexOf("/")
  //     // || page.substring(page.lastIndexOf("/") + 1, page.lastIndexOf("."))
  //     if (!name) {
  //       const pageList = page.split("/")
  //       filename = pageList[pageList.length - 2]
  //     }
  //     pages[filename] = {
  //       entry: page,
  //       // filename: filename + ".html",
  //       chunks: ["chunk-vendors", "chunk-common", filename],

  //       // ...commonConfig,
  //       splitChunks: "all"
  //       // template: `public/${name || "home"}.html`
  //     }
  //     return pages[filename]
  //   })
  // },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "./"
  },
  plugins: [
    require("autoprefixer"),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    ...pagesArr(entries),
    new copyWebpackPlugin([
      {
        from: __dirname + "/src/img", //打包的静态资源目录地址
        to: "./img" //打包到dist下面的public
      }
    ]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "css/[name].css"
      // chunkFilename: "[id].css"
    }), //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        // commons: {
        //   // 实际路径
        //   test: path.resolve(__dirname, "src/lib/jquery.min.js"),
        //   name: "jq",
        //   chunks: "all",
        //   enforce: true
        // }
        // commons: {
        //   name: "commons", // 将公共模块提取，生成名为`commons`的chunk
        //   chunks: "all",
        //   minChunks: chunks.length // 提取所有entry共同依赖的模块
        // }
      }
    }
  },
  devServer: {
    contentBase: [path.join(__dirname, "dist"), path.join(__dirname, "src")],
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: false, //不压缩html
              removeComments: false,
              collapseWhitespace: false,
              interpolate: true,
              attrs: false
            }
          }
          // "raw-loader"
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                require("autoprefixer")({
                  browsers: [
                    "> 0.5%",
                    "last 2 versions",
                    "Firefox ESR",
                    "not dead",
                    "iOS >= 8",
                    "Firefox >= 20",
                    "Android > 4.4"
                  ]
                })
              ]
            }
          },
          "less-loader"
        ]
      },
      {
        test: /\.jpg|png|jpeg|gif$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 4000,
              outputPath: "/img/",
              name: "[name].[ext]",
              publicPath: "../img"
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        loader: "file-loader",
        options: {
          outputPath: "fonts",
          name: "[name].[ext]"
        }
      }
    ]
  }
}
