import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalDb = globalThis as typeof globalThis & { essenceDb?: PrismaClient };

export function database() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL ausente.");
  return (globalDb.essenceDb ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString, max: 5, connectionTimeoutMillis: 5000 }),
  }));
}
