"use strict";

module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    requireConfigFile: false,
    babelOptions: {
      plugins: [
        ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
      ],
    },
  },
  plugins: ["ember"],
  extends: ["eslint:recommended", "plugin:ember/recommended"],
  env: {
    browser: true,
  },
  rules: {
    "ember/no-get": "off",
    "ember/no-actions-hash": "off",
    "ember/no-classic-classes": "off",
    "ember/no-classic-components": "off",
    "ember/require-tagless-components": "off",
    "ember/no-component-lifecycle-hooks": "off",
  },
  overrides: [
    // node files
    {
      files: [
        "./.eslintrc.js",
        "./.prettierrc.js",
        "./.stylelintrc.js",
        "./.template-lintrc.js",
        "./ember-cli-build.js",
        "./index.js",
        "./testem.js",
        "./blueprints/*/index.js",
        "./config/**/*.js",
        "./tests/dummy/config/**/*.js",
      ],
      parserOptions: {
        sourceType: "script",
      },
      env: {
        browser: false,
        node: true,
      },
      extends: ["plugin:n/recommended"],
    },
    {
      // test files
      files: ["tests/**/*-test.{js,ts}"],
      extends: ["plugin:qunit/recommended"],
      rules: {
        "qunit/no-assert-equal": "off",
        "qunit/no-conditional-assertions": "off",
        "qunit/no-negated-ok": "off",
      },
    },
  ],
};
