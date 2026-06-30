import type { LoginInput, RegisterInput } from "@bugflow/shared";
import type { AuthResult, AuthTokens, AuthUser } from "@bugflow/types";
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { User } from "@prisma/client";
import * as argon2 from "argon2";

import { PrismaService } from "../prisma/prisma.service";

import type { AccessTokenPayload, RefreshTokenPayload } from "./auth.types";

/** Logique métier d'authentification (Étape 2). */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /** Inscrit un nouvel utilisateur et ouvre une session. */
  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ConflictException("Un compte existe déjà pour cet email.");
    }
    const passwordHash = await argon2.hash(input.password);
    const user = await this.prisma.user.create({
      data: { email: input.email, name: input.name ?? null, passwordHash },
    });
    return this.openSession(user);
  }

  /** Vérifie les identifiants et ouvre une session. */
  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await argon2.verify(user.passwordHash, input.password))) {
      throw new UnauthorizedException("Identifiants invalides.");
    }
    return this.openSession(user);
  }

  /** Rafraîchit la session après vérification du refresh token courant. */
  async refresh(userId: string, refreshToken: string): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException("Session expirée.");
    }
    const matches = await argon2.verify(user.hashedRefreshToken, refreshToken);
    if (!matches) {
      throw new UnauthorizedException("Session expirée.");
    }
    return this.openSession(user);
  }

  /** Révoque la session courante (invalide le refresh token stocké). */
  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
  }

  /** Retourne le profil public d'un utilisateur. */
  async getAuthUser(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable.");
    }
    return AuthService.toAuthUser(user);
  }

  /** Génère les jetons, persiste le hash du refresh, renvoie le résultat. */
  private async openSession(user: User): Promise<AuthResult> {
    const tokens = await this.issueTokens(user);
    const hashedRefreshToken = await argon2.hash(tokens.refreshToken);
    await this.prisma.user.update({ where: { id: user.id }, data: { hashedRefreshToken } });
    return { user: AuthService.toAuthUser(user), tokens };
  }

  private async issueTokens(user: User): Promise<AuthTokens> {
    const accessPayload: AccessTokenPayload = { sub: user.id, email: user.email };
    const refreshPayload: RefreshTokenPayload = { sub: user.id };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(accessPayload, {
        secret: this.config.getOrThrow<string>("JWT_ACCESS_SECRET"),
        expiresIn: this.config.get<string>("JWT_ACCESS_TTL") ?? "15m",
      }),
      this.jwt.signAsync(refreshPayload, {
        secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
        expiresIn: this.config.get<string>("JWT_REFRESH_TTL") ?? "7d",
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private static toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
