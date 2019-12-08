const path = require('path');

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
      'react-dom': '@hot-loader/react-dom',
      'react-lifecycle-visualizer': path.join(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }], // NOTE: needs to precede ..-class-properties!
            ['@babel/plugin-proposal-class-properties', {loose: false}],
            'react-hot-loader/babel'
          ]
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
    contentBase: './public'
  }
};
