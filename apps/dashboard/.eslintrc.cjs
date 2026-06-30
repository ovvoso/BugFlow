/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["../../.eslintrc.cjs", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  parserOptions: { project: "./tsconfig.json" },
  settings: { react: { version: "detect" } },
  rules: {
    "react/react-in-jsx-scope": "off",
  },
};
