/*
 *  Copyright 2020 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const ESLintPlugin = require('eslint-webpack-plugin');

const OUT_DIR = 'dist';
const OUT_PATH = path.resolve(__dirname, OUT_DIR);
const NODE_ENV =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

const baseConfig = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  devtool: 'source-map',
  target: 'browserslist:last 2 versions',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new ESLintPlugin({extensions: ['js', 'ts', '.json']}),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
};

let envConfig = {};

if (NODE_ENV === 'production') {
  envConfig = {
    optimization: {
      minimizer: [new TerserPlugin({sourceMap: true})],
    },
  };
} else {
  envConfig = {
    devServer: {
      port: 9000,
    },
  };
}

module.exports = [
  {
    name: 'lib-commonjs',
    ...baseConfig,
    ...envConfig,
    output: {
      filename: `cogment.js`,
      path: OUT_PATH,
      library: 'cogment',
      libraryTarget: 'commonjs',
      globalObject: 'this',
    },
  },
  {
    name: 'lib-umd',
    ...baseConfig,
    ...envConfig,
    output: {
      filename: `cogment.umd.js`,
      path: OUT_PATH,
      library: 'cogment',
      libraryTarget: 'umd',
      globalObject: 'this',
    },
  },
  {
    name: 'lib-esm',
    experiments: {
      outputModule: true,
    },
    ...baseConfig,
    ...envConfig,
    output: {
      filename: `cogment.esm.js`,
      path: OUT_PATH,
      library: 'cogment',
      libraryTarget: 'module',
      globalObject: 'this',
      module: true,
    },
  },
];
