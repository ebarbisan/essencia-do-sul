import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { database } from "./prisma";

export const sessionAge = 8 * 60 * 60;
export const sessionCookie = process.env.NODE_ENV === "production" ? "__Host-essencia-session" : "essencia-session";
export const sessionOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function validToken(token: string | undefined): token is string {
  return Boolean(token && /^[a-f0-9]{64}$/.test(token));
}

const dummyHash = bcrypt.hashSync(randomBytes(32).toString("hex"), 12);

export async function authenticate(email: string, password: string) {
  const matches = await database().user.findMany({
    where: { email: { equals: email, mode: "insensitive" }, accessEnabled: true },
    select: { id: true, password: true },
    take: 2,
  });
  const user = matches.length === 1 ? matches[0] : undefined;
  const valid = await bcrypt.compare(password, user?.password ?? dummyHash);
  return valid ? user : undefined;
}

export async function createSession(user: { id: number; password: string }, previous?: string) {
  const token = randomBytes(32).toString("hex");
  const now = new Date();
  return database().$transaction(async (tx) => {
    // Serialize session creation with password rotation.
    const [active] = await tx.$queryRaw<{ id: number }[]>`
      SELECT "id" FROM "User"
      WHERE "id" = ${user.id} AND "password" = ${user.password} AND "accessEnabled"
      FOR UPDATE
    `;
    if (!active) return null;

    await tx.session.deleteMany({
      where: { OR: [{ expiresAt: { lte: now } }, ...(validToken(previous) ? [{ tokenHash: tokenHash(previous) }] : [])] },
    });
    await tx.session.create({
      data: { tokenHash: tokenHash(token), userId: user.id, expiresAt: new Date(now.getTime() + sessionAge * 1000) },
    });
    return token;
  });
}

export async function revokeSession(token: string | undefined) {
  if (validToken(token)) await database().session.deleteMany({ where: { tokenHash: tokenHash(token) } });
}

export async function sessionUser() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!validToken(token)) return null;
  const session = await database().session.findFirst({
    where: { tokenHash: tokenHash(token), expiresAt: { gt: new Date() }, user: { accessEnabled: true } },
    select: { user: { select: { name: true, role: true } } },
  });
  return session?.user ?? null;
}
