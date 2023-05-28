const webpack = require('webpack')

module.exports = {
  publicPath: process.env.VUE_APP_ENVIRONMENT === 'dev' ? '/' : '/archaeon-ui/',
  runtimeCompiler: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_JSON: '"' + escape(JSON.stringify(require('./package.json'))) + '"'
        }
      })
    ]
  }
}
