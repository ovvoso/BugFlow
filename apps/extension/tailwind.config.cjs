const preset = require("../../tailwind.preset.cjs");

/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx,html}", "../../packages/ui/src/**/*.{ts,tsx}"],
};
