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
      '/socket.io': {
        target: 'http://localhost:1756',
        ws: true,
        changeOrigin: true
      },
      '/sockjs-node': {
        target: 'http://localhost:1756',
        ws: false,
        changeOrigin: true
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
