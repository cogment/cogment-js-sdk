/*
 *  Copyright 2021 Artificial Intelligence Redefined <dev+cogment@ai-r.com>
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

const webpackCommon = require('./webpack.common');
const {merge} = require('webpack-merge');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const NODE_ENV =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = [
  merge(webpackCommon, require(`./webpack.${NODE_ENV}.js`), {
    name: 'cogment-commonjs',
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../public/webpack/cjs/index.html',
        openAnalyzer: false,
        generateStatsFile: true,
        statsOptions: {preset: 'verbose'},
        statsFilename: '../public/webpack/cjs/stats.json',
      }),
    ],
    output: {
      filename: `[name].js`,
      uniqueName: 'cogment-commonjs',
      library: {
        type: 'commonjs2',
      },
    },
  }),
  merge(webpackCommon, require(`./webpack.${NODE_ENV}.js`), {
    name: 'cogment-umd',
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../public/webpack/umd/index.html',
        openAnalyzer: false,
        generateStatsFile: true,
        statsOptions: {preset: 'verbose'},
        statsFilename: '../public/webpack/umd/stats.json',
      }),
    ],
    output: {
      filename: `[name].umd.js`,
      globalObject: 'this',
      uniqueName: 'cogment-umd',
      library: {
        type: 'umd',
      },
    },
  }),
  merge(webpackCommon, require(`./webpack.${NODE_ENV}.js`), {
    name: 'cogment-esm',
    experiments: {
      outputModule: true,
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../public/webpack/esm/index.html',
        openAnalyzer: false,
        generateStatsFile: true,
        statsOptions: {preset: 'verbose'},
        statsFilename: '../public/webpack/esm/stats.json',
      }),
    ],
    output: {
      filename: `[name].esm.js`,
      module: true,
      scriptType: 'module',
      uniqueName: 'cogment-esm',
      libraryTarget: 'module',
      library: {
        type: 'module',
      },
    },
  }),
];
