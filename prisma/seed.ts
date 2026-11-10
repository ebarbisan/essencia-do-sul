import "dotenv/config";
import bcrypt from "bcryptjs";
import { database } from "../lib/prisma";
import { emailSchema } from "../lib/validation";

async function main() {
  const email = emailSchema.parse(process.env.ACCOUNT_EMAIL);
  const name = process.env.ACCOUNT_NAME?.trim();
  const password = process.env.ACCOUNT_PASSWORD ?? "";
  const role = process.env.ACCOUNT_ROLE ?? "REVENDEDOR";
  const rotate = process.argv.includes("--rotate");

  if (!name || name.length > 120 || Buffer.byteLength(password) < 16 || Buffer.byteLength(password) > 72) {
    throw new Error("Informe nome de até 120 caracteres e senha exclusiva de 16 a 72 bytes.");
  }
  if (role !== "ADMIN" && role !== "REVENDEDOR") throw new Error("Papel de conta inválido.");

  const db = database();
  try {
    const hash = await bcrypt.hash(password, 12);
    await db.$transaction(async (tx) => {
      const matches = await tx.user.findMany({
        where: { email: { equals: email, mode: "insensitive" } },
        select: { id: true, role: true },
        take: 2,
      });
      if (matches.length > 1) throw new Error("Há cadastros conflitantes para esse e-mail.");
      const user = matches[0];
      if (user) {
        if (!rotate || user.role !== role) throw new Error("Use --rotate com o papel atual para reativar a conta.");
        await tx.user.update({ where: { id: user.id }, data: { password: hash, accessEnabled: true } });
        await tx.session.deleteMany({ where: { userId: user.id } });
      } else {
        if (rotate) throw new Error("Conta para rotação não encontrada.");
        await tx.user.create({ data: { email, name, role, password: hash, accessEnabled: true } });
      }
    });
    console.log("Acesso provisionado.");
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "";
  const safeMessages = /^(Informe nome|Papel de conta|Há cadastros|Use --rotate|Conta para rotação)/;
  console.error(safeMessages.test(message) ? message : "Falha no provisionamento. Confira os dados e a conexão com o banco.");
  process.exitCode = 1;
});
