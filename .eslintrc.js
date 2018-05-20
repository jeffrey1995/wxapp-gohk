// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: false,
    es6: true
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html',
    "prefer-object-spread"
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    "semi":"off",
    "import/no-unresolved":"off",
    "import/extensions":"off",
    "import/first":"off",
    "import/no-dynamic-require":"off",
    "import/no-extraneous-dependencies":"off",
    "import/no-named-as-default-member": "off",
    "linebreak-style":"off",
    "global-require":"off",
    "prefer-object-spread/prefer-object-spread": 2,
    "no-unused-expressions":["error", { "allowShortCircuit": true, "allowTernary": true }],
    "comma-dangle": ["error", "only-multiline"],
    "no-param-reassign": ["error", { "props": false }],
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "no-restricted-syntax": "off",
     // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  globals: {
    App: true,
    Page: true,
    wx: true,
    getApp: true,
    getPage: true
  }
}
