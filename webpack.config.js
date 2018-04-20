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
      use: [{
        loader: 'babel-loader',
        options: {
          plugins: ['react-hot-loader/babel', 'transform-react-jsx-source', 'transform-decorators-legacy']
        }
      }, {
        loader: 'eslint-loader',
        options: {
          emitWarning: true
        }
      }],
      exclude: /node_modules/
    }, {
      test: /\.(css|scss)$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }]
  },
  resolve: {
    alias: {
      'react-lifecycle-visualizer': path.join(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx']
  },
  devServer: {
    port: devServerPort,
    contentBase: './public'
  }
};
