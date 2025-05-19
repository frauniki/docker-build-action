module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off', // Allow console.log since it's used throughout the codebase
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    semi: ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      env: {
        node: true,
        es2021: true,
        jest: true, // Use jest environment for test files
      },
      plugins: ['vitest'],
    },
  ],
};
