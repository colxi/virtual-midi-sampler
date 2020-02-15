const path = require('path')

module.exports = {
  entry: path.join(__dirname, './src/main.ts'),
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
    library: '__MODULE_DEFAULT_EXPORT__',
    libraryTarget: 'window',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve('src')
    }
  }
}
