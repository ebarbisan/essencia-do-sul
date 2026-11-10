import { database } from "../../../lib/prisma";
import { readJson, result, sameOrigin } from "../../../lib/http";
import { rateAllowed } from "../../../lib/rate-limit";
import { requestSchema } from "../../../lib/validation";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return result(403, "Origem da solicitação inválida.");
  const input = requestSchema.safeParse(await readJson(request));
  if (!input.success) return result(400, "Confira o nome, a cidade e o telefone ou e-mail.");

  try {
    if (!await rateAllowed("revenda", "global", 120)) {
      return result(429, "Muitas solicitações neste momento. Tente novamente em alguns minutos.");
    }
    const { nome, cidade, contato, documento, mensagem } = input.data;
    await database().revendedorRequest.create({
      data: { nome, cidade, contato, documento, mensagem: mensagem || null },
    });
    return result(200);
  } catch {
    console.error("Falha no armazenamento de solicitação de revenda.");
    return result(503, "O formulário está indisponível no momento. Tente novamente ou fale pelo WhatsApp.");
  }
}
