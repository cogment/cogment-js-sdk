module.exports = {
  collectCoverage: true,
  preset: 'ts-jest',
  reporters: ['default', 'jest-junit'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*(*.)@(test).[t]s?(x)'],
};
