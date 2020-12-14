const path = require('path');
module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devtool: 'source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false,
  },
  devServer: {
    liveReload: true,
  },
};
