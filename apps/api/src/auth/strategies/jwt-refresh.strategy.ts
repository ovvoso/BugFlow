import { REFRESH_TOKEN_COOKIE } from "@bugflow/shared";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { JwtFromRequestFunction } from "passport-jwt";

import type { AuthenticatedUserWithRefresh, RefreshTokenPayload } from "../auth.types";

/**
 * Extrait le refresh token depuis le cookie httpOnly (clients web) ou,
 * à défaut, depuis l'en-tête `Authorization: Bearer` (extension Chrome).
 */
const extractRefreshToken: JwtFromRequestFunction = (req: Request): string | null => {
  const fromCookie = (req.cookies as Record<string, string> | undefined)?.[REFRESH_TOKEN_COOKIE];
  if (fromCookie) {
    return fromCookie;
  }
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

/** Valide le refresh token et expose le jeton brut pour la rotation. */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(config: ConfigService) {
    const secret = config.get<string>("JWT_REFRESH_SECRET");
    if (!secret) {
      throw new Error("JWT_REFRESH_SECRET manquant dans l'environnement.");
    }
    super({
      jwtFromRequest: extractRefreshToken,
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: RefreshTokenPayload): AuthenticatedUserWithRefresh {
    const refreshToken = extractRefreshToken(req);
    if (!payload?.sub || !refreshToken) {
      throw new UnauthorizedException();
    }
    return { id: payload.sub, refreshToken };
  }
}
