/**
 * Convention de commits — Conventional Commits.
 * Format : <type>(scope): description
 * Types autorisés : feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "extension",
        "dashboard",
        "api",
        "shared",
        "ui",
        "types",
        "docs",
        "repo",
        "deps",
        "release",
      ],
    ],
    "subject-case": [2, "never", ["upper-case", "pascal-case"]],
  },
};
