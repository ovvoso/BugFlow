/**
 * Preset Tailwind partagé — source unique de vérité du design BugFlow (DRY).
 * Importé par le dashboard, l'extension et @bugflow/ui.
 *
 * Style UI : moderne, sobre, professionnel. Palette "indigo" comme couleur de marque.
 */
/** @type {Partial<import("tailwindcss").Config>} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          900: "#312e81",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
};
