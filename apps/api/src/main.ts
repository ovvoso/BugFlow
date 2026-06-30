import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

/**
 * Point d'entrée de l'API BugFlow.
 * Configure le préfixe global, le parsing des cookies (refresh token httpOnly)
 * et le CORS pour le dashboard et l'extension Chrome.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.use(cookieParser());

  const dashboardOrigin = process.env.DASHBOARD_ORIGIN ?? "http://localhost:5173";
  app.enableCors({
    origin: [dashboardOrigin, /^chrome-extension:\/\//],
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.warn(`[BugFlow API] Auth running on port ${port}`);
}

void bootstrap();
