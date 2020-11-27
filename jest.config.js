// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const {defaults: tsjPreset} = require('ts-jest/presets');

// eslint-disable-next-line no-undef
module.exports = {
  collectCoverage: true,
  preset: 'ts-jest',
  reporters: ['default', 'jest-junit'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*(*.)@(test).[t]s?(x)'],
  testPathIgnorePatterns: [
    '/node_modules/', // default
    '<rootDir>/templates/', // don't run tests in the templates
    '<rootDir>/test/.*/fixtures/', // don't run tests in fixtures
    '<rootDir>/stage-.*/', // don't run tests in auto-generated (and auto-removed) test dirs
  ],
  transform: {...tsjPreset.transform},
};
