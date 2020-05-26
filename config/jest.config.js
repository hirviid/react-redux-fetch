module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.base.json',
    },
  },
  rootDir: '../packages',
  projects: ['<rootDir>'],
  testMatch: ['<rootDir>/*/src/**/__tests__/**/*.test.ts?(x)'],
  testPathIgnorePatterns: ['/examples', '/docusaurus'],
};
