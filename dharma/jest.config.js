export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  globals: {
    localStorage: undefined,
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.spec.ts'],
  rootDir: '.',
  testPathIgnorePatterns: ['/node_modules/', '/clases/', '/lib/', '/web-personal/', '/gastos/'],
  injectGlobals: false,
};
