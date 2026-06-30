import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/** Protège une route en exigeant un access token valide. */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
