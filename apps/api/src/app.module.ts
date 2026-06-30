import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";

/**
 * Module racine de l'application.
 *
 * Architecture modulaire (Feature First) : chaque fonctionnalité est un module dédié.
 * Étape 2 : authentification (AuthModule) + accès données (PrismaModule global).
 */
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
