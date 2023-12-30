console.log("😶‍🌫️😶‍🌫️😶‍🌫️ .eslintrc.js");

module.exports = {
  root: true,
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignorePatterns: ["dist", "node_modules"],

  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],

  overrides: [],
};
