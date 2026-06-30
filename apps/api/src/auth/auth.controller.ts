import { loginSchema, REFRESH_TOKEN_COOKIE, registerSchema } from "@bugflow/shared";
import type { LoginInput, RegisterInput } from "@bugflow/shared";
import type { AuthResult, AuthUser } from "@bugflow/types";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { CookieOptions, Response } from "express";

import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";

import { AuthService } from "./auth.service";
import type { AuthenticatedUser, AuthenticatedUserWithRefresh } from "./auth.types";
import { CurrentUser } from "./decorators/current-user.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";

/** Durée de vie du cookie de refresh : 7 jours (aligné sur JWT_REFRESH_TTL). */
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(new ZodValidationPipe(registerSchema)) dto: RegisterInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResult> {
    const result = await this.auth.register(dto);
    this.setRefreshCookie(res, result.tokens.refreshToken);
    return result;
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(loginSchema)) dto: LoginInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResult> {
    const result = await this.auth.login(dto);
    this.setRefreshCookie(res, result.tokens.refreshToken);
    return result;
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser() user: AuthenticatedUserWithRefresh,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResult> {
    const result = await this.auth.refresh(user.id, user.refreshToken);
    this.setRefreshCookie(res, result.tokens.refreshToken);
    return result;
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.auth.logout(user.id);
    res.clearCookie(REFRESH_TOKEN_COOKIE, this.cookieOptions());
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthenticatedUser): Promise<AuthUser> {
    return this.auth.getAuthUser(user.id);
  }

  private setRefreshCookie(res: Response, refreshToken: string): void {
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...this.cookieOptions(),
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    });
  }

  private cookieOptions(): CookieOptions {
    const isProd = this.config.get<string>("NODE_ENV") === "production";
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    };
  }
}
