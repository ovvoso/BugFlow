/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["../../.eslintrc.cjs"],
  parserOptions: { project: "./tsconfig.json" },
  rules: {
    // NestJS s'appuie fortement sur les décorateurs et l'injection
    "@typescript-eslint/no-extraneous-class": "off",
  },
};
