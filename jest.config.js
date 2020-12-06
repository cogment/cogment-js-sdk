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

module.exports = {
  collectCoverage: true,
  coverageReporters: [
    'clover',
    ['html-spa', {subdir: 'report'}],
    'json',
    'lcov',
    'text',
    'text-summary',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/src/cogment/api'],
  //  coverageProvider: 'v8',
  preset: 'ts-jest',
  reporters: ['default', 'jest-junit'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*(*.)@(test).[t]s?(x)'],
  verbose: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
