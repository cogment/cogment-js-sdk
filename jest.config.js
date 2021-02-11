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

const {defaultsDeep} = require('lodash');

const commonConfig = {
  prettierPath: './node_modules/.bin/prettier',
  preset: 'ts-jest',
  setupFilesAfterEnv: [
    './jest.setup.js',
    'jest-chain',
    'jest-extended',
    'jest-allure/dist/setup',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/end-to-end/cogment-app',
    '<rootDir>/src/cogment/api',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/public/',
    '<rootDir>/coverage/',
    '<rootDir>/cli/',
    '<rootDir>/CHANGELOG.md',
    '<rootDir>/.gitlab/',
    '<rootDir>/.github/',
  ],
};

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
  reporters: ['default', 'jest-junit', 'jest-sonar'],
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  slowTestThreshold: 10,
  testEnvironment: 'jsdom',
  verbose: true,
  projects: [
    defaultsDeep(
      {
        displayName: 'lint:prettier',
        testMatch: ['<rootDir>/src/**/*.ts'],
        runner: 'prettier',
      },
      commonConfig,
    ),
    defaultsDeep(
      {
        displayName: 'lint:eslint',
        testMatch: ['<rootDir>/src/**/*.ts'],
        runner: 'eslint',
      },
      commonConfig,
    ),
    defaultsDeep(
      {
        displayName: 'lint:remark',
        testMatch: ['<rootDir>/**/*.md'],
        preset: 'jest-runner-remark',
      },
      commonConfig,
    ),
    defaultsDeep(
      {
        preset: 'ts-jest',
        displayName: '__tests__',
        testMatch: ['<rootDir>/__tests__/**/*.test.*'],
      },
      commonConfig,
    ),
  ],
};
