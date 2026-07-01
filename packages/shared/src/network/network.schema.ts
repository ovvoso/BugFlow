/**
 * Schéma de validation des logs réseau bruts (Étape 6).
 *
 * Fonctions pures (Zod). Le tampon lu dans la page est du contenu externe :
 * il doit être validé aux frontières avant normalisation.
 */
import { z } from "zod";

/** Entrée réseau brute telle que produite par le collecteur dans la page. */
export const networkLogEntrySchema = z.object({
  method: z.string(),
  url: z.string(),
  status: z.number(),
  durationMs: z.number(),
  startedAt: z.string(),
});

/** Tampon réseau brut (liste de requêtes). */
export const networkLogsSchema = z.array(networkLogEntrySchema);

export type RawNetworkLogEntry = z.infer<typeof networkLogEntrySchema>;
