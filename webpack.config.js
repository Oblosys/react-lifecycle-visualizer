const path = require('path');

const devServerPort = 8001;

module.exports = {
  entry: path.join(__dirname, 'examples/src/index.jsx'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'client-bundle.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: [
        'babel-loader',
        'eslint-loader'
      ],
      exclude: /node_modules/
    }, {
      test: /\.(css|scss)$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }]
  },
  resolve: {
      extensions: ['.js', '.jsx']
  },
  devServer: {
    port: devServerPort,
    contentBase: './public'
  }
};
