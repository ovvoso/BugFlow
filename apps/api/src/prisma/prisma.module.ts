import { Global, Module } from "@nestjs/common";

import { PrismaService } from "./prisma.service";

/**
 * Module d'infrastructure d'accès aux données.
 * `@Global` : le PrismaService est injectable dans toutes les features sans réimport.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
