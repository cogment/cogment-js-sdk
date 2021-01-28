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
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/cogment/api',
    'src/__data__',
    '.d.ts',
    'cli',
  ],
  displayName: 'cogment',
  preset: 'ts-jest',
  prettierPath: './node_modules/.bin/prettier',
  reporters: ['default', 'jest-junit', 'jest-sonar'],
  setupFilesAfterEnv: ['./jest.setup.js', 'jest-allure/dist/setup'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/end-to-end/cogment-app',
    '<rootDir>/src/__mocks__/',
    '<rootDir>/src/__data__/',
    '<rootDir>/src/cogment/api',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/public/',
    '<rootDir>/coverage',
    '<rootDir>/cli',
    'cog_settings.js',
  ],
  verbose: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
