module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:1756/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/socket': {
        target: 'http://localhost:1756',
        changeOrigin: true,
        pathRewrite: {
          '^/socket': ''
        }
      }
    }
  },
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      axios: 'axios',
      'element-ui': 'ELEMENT'
    }
  }
}
