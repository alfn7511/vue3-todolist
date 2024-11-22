const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  productionSourceMap: true,
  configureWebpack: {
    devtool: 'source-map',
    optimization: {
      splitChunks: false,
    },
  },
  devServer: {
    client: {
      overlay: false,
    },
  },
  css: {
    sourceMap: true,
    extract: false,
    loaderOptions: {
      sass: {
        sassOptions: {
          silenceDeprecations: ['legacy-js-api'],
          quietDeps: true,
        },
      },
    },
  },
})
