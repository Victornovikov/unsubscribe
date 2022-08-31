module.exports = {
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'rules': {
    'quotes': [2, 'single', { 'avoidEscape': true }],
    'indent': [
      'error',
      2 
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    // "quotes": [
    //   "error",
    //   "double"
    // ],
    'semi': [
      'error',
      'never'
    ]
  }
}
