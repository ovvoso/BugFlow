import { BadRequestException, Injectable } from "@nestjs/common";
import type { PipeTransform } from "@nestjs/common";
import type { ZodSchema } from "zod";

/**
 * Valide une entrée externe (body, query, ...) via un schéma Zod partagé
 * de `@bugflow/shared`. Toute donnée non conforme est rejetée en 400
 * (validation aux frontières).
 */
@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        message: "Données invalides.",
        errors: result.error.flatten().fieldErrors,
      });
    }
    return result.data;
  }
}
