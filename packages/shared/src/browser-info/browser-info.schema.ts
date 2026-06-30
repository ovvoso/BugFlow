/**
 * Schéma de validation des informations navigateur brutes (Étape 4).
 *
 * Fonctions pures (Zod). Les données collectées dans la page (navigator,
 * screen, window, location) sont du contenu externe : elles doivent être
 * validées aux frontières avant normalisation.
 */
import { z } from "zod";

/** Entier positif (dimensions, en pixels). */
const positiveInt = z.number().int().nonnegative();

/** Forme brute renvoyée par le collecteur injecté dans la page. */
export const rawBrowserInfoSchema = z.object({
  userAgent: z.string().min(1),
  language: z.string().min(1),
  screenWidth: positiveInt,
  screenHeight: positiveInt,
  viewportWidth: positiveInt,
  viewportHeight: positiveInt,
  url: z.string().url(),
});

export type RawBrowserInfo = z.infer<typeof rawBrowserInfoSchema>;
