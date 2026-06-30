import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/** Protège la route de rafraîchissement en exigeant un refresh token valide. */
@Injectable()
export class JwtRefreshGuard extends AuthGuard("jwt-refresh") {}
