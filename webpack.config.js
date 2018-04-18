const path = require('path');
const devServerPort = 8001;

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'client-bundle.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: "babel-loader",
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    }]
  },
  resolve: {
      extensions: [".js", ".jsx"]
  },
  devServer: {
    port: devServerPort,
    contentBase: "./public"
  }
};
