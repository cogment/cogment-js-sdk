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

const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './tsconfig.json',
      './cli/tsconfig.json',
      './__tests__/tsconfig.json',
      './__tests__/end-to-end/cogment-app/webapp/tsconfig.json',
    ],
  },
  plugins: [
    '@typescript-eslint',
    'sonarjs',
    'unicorn',
    'jest',
    'jest-formatting',
    'tsdoc',
    'deprecation',
    'notice',
    'import',
    'promise',
  ],
  env: {
    browser: true,
    jest: true,
    commonjs: true,
    'shared-node-browser': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/standard',
    'plugin:compat/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:jest-formatting/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:promise/recommended',
  ],
  rules: {
    'tsdoc/syntax': 'error',
    'unicorn/filename-case': [
      'error',
      {cases: {pascalCase: true, kebabCase: true}},
    ],
    'deprecation/deprecation': 'warn',
    'max-params': ['error', {max: 2}],
    'notice/notice': [
      'error',
      {
        mustMatch: `Copyright ${new Date().getFullYear()} Artificial Intelligence Redefined <dev\\+cogment@ai-r\\.com>`,
        templateFile: path.resolve(__dirname, 'config/copyright.js'),
        onNonMatchingHeader: 'replace',
      },
    ],
    'unicorn/no-array-for-each': 'off',
  },
  reportUnusedDisableDirectives: true,
};
