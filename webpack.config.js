const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const devServerPort = 8000;

module.exports = {
  entry: path.join(__dirname, 'examples/parent-child-demo/src/index.js'),
  output: {
    path: path.join(__dirname, 'dist-demo'),
    filename: 'client-bundle.js',
    publicPath: '/dist-demo/'
  },
  resolve: {
    alias: {
      'react-lifecycle-visualizer': path.join(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx']
  },
  plugins: [new ESLintPlugin({ emitWarning: true })],
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: [{
        loader: 'babel-loader',
        options: { configFile: './.babelrc' }
      }],
      exclude: /node_modules/
    }, {
      test: /\.(css|scss)$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            // eslint-disable-next-line global-require
            implementation: require('sass')
          }
        }
      ]
    }]
  },
  devServer: {
    host: '0.0.0.0',
    port: devServerPort,
    static: [path.join(__dirname, 'public')]
  }
};
