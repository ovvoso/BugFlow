/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["../../.eslintrc.cjs", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  parserOptions: { project: "./tsconfig.json" },
  settings: { react: { version: "detect" } },
  env: { browser: true, webextensions: true },
  rules: {
    "react/react-in-jsx-scope": "off",
  },
};
