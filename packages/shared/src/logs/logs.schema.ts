/**
 * Schéma de validation des logs JavaScript bruts (Étape 5).
 *
 * Fonctions pures (Zod). Le tampon lu dans la page est du contenu externe :
 * il doit être validé aux frontières avant normalisation.
 */
import { z } from "zod";

/** Entrée de log brute telle que produite par le collecteur dans la page. */
export const jsLogEntrySchema = z.object({
  level: z.enum(["error", "warning"]),
  message: z.string(),
  source: z.string().nullable(),
  timestamp: z.string(),
});

/** Tampon de logs brut (liste d'entrées). */
export const jsLogsSchema = z.array(jsLogEntrySchema);

export type RawJsLogEntry = z.infer<typeof jsLogEntrySchema>;
