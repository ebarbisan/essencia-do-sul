import { createHmac } from "node:crypto";
import { database } from "./prisma";

const minutes = 15;
const windowMs = minutes * 60 * 1000;

export async function rateAllowed(scope: string, subject: string, max: number) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) throw new Error("Configure RATE_LIMIT_SECRET.");
  const key = createHmac("sha256", secret).update(scope + ":" + subject).digest("hex");
  const db = database();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);
  const [row] = await db.$queryRaw<{ attempts: number }[]>`
    INSERT INTO "RateLimit" ("key", "attempts", "expiresAt")
    VALUES (${key}, 1, ${expiresAt})
    ON CONFLICT ("key") DO UPDATE SET
      "attempts" = CASE WHEN "RateLimit"."expiresAt" <= ${now} THEN 1
                        ELSE LEAST("RateLimit"."attempts", ${max}) + 1 END,
      "expiresAt" = CASE WHEN "RateLimit"."expiresAt" <= ${now} THEN ${expiresAt}
                         ELSE "RateLimit"."expiresAt" END
    RETURNING "attempts"
  `;
  return row.attempts <= max;
}
