const path = require('path')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463

   */
  /*
  pages: {
    index: {
      entry: 'src/main.js',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  */
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)

      // new webpack.ProvidePlugin({
      //   $: "jquery",
      //   jQuery: "jquery",
      //   "windows.jQuery": "jquery"
      // })
    ],

    externals: {
      AMap: 'AMap',
      AMapUI: 'AMapUI'
    }
  },

  chainWebpack: config => {
    config.resolve.symlinks(true);
    config.resolve.alias.set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    /* svgRule.oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    */
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          'primary-color': '#1BD39B',
          'link-color': '#1BD39B',
          'border-radius-base': '2px'
        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    port: 8000,
    proxy: {
      '/api_c': {
        // target: 'http://115.29.226.189:1889/WcsService.svc',
        target: 'http://192.168.0.247:1889/WcsService.svc',
        changeOrigin: true,
        pathRewrite: {
          '^/api_c': ''
        }
      },

      '/static-file': {
        // target: 'http://115.29.226.189:1889',
        target: 'http://192.168.0.247:1889',
        changeOrigin: true,
        pathRewrite: {
          '^/static-file': ''
        }
      },

      '/api_java': {
        // target: 'http://115.29.226.189:18881',
        target: 'http://192.168.0.247:18881',//192.168.0.247
        changeOrigin: true,
        pathRewrite: {
          '^/api_java': ''
        }
      },
      '/api_javatest': {
        target: 'http://192.168.0.101:18880',
        // target: 'http://192.168.0.236:18880',
        changeOrigin: true,
        pathRewrite: {
          '^/api_javatest': ''
        }
      }
    }
  },

  productionSourceMap: false,
  lintOnSave: false,
  transpileDependencies: []
}
