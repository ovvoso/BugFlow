/**
 * Schémas de validation d'authentification (Étape 2).
 *
 * Fonctions pures (Zod) partagées entre l'API et les clients. Toute entrée
 * externe (réseau, message extension) doit être validée via ces schémas
 * (validation aux frontières).
 */
import { z } from "zod";

import { NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "./auth.constants";

/** Mot de passe : longueur encadrée + au moins une lettre et un chiffre. */
const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`)
  .max(PASSWORD_MAX_LENGTH, `Le mot de passe ne doit pas dépasser ${PASSWORD_MAX_LENGTH} caractères.`)
  .regex(/[A-Za-z]/, "Le mot de passe doit contenir au moins une lettre.")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.");

/** Email normalisé (trim + minuscules). */
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Adresse email invalide.");

/** Données d'inscription. */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z
    .string()
    .trim()
    .max(NAME_MAX_LENGTH, `Le nom ne doit pas dépasser ${NAME_MAX_LENGTH} caractères.`)
    .optional(),
});

/** Données de connexion (mot de passe non re-validé sur la forme). */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Le mot de passe est requis."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
