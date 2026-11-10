import type { NextRequest } from "next/server";
import { authenticate, createSession, sessionAge, sessionCookie, sessionOptions } from "../../../../lib/auth";
import { readJson, result, sameOrigin } from "../../../../lib/http";
import { rateAllowed } from "../../../../lib/rate-limit";
import { loginSchema } from "../../../../lib/validation";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return result(403, "Origem da solicitação inválida.");
  const input = loginSchema.safeParse(await readJson(request));
  if (!input.success) return result(400, "Confira o e-mail e a senha.");

  try {
    const { email, password } = input.data;
    if (!await rateAllowed("login", "global", 240) || !await rateAllowed("login", email, 8)) {
      return result(429, "Muitas tentativas. Aguarde alguns minutos antes de tentar de novo.");
    }

    const user = await authenticate(email, password);
    if (!user) return result(401, "E-mail ou senha inválidos.");

    const token = await createSession(user, request.cookies.get(sessionCookie)?.value);
    if (!token) return result(401, 'E-mail ou senha inválidos.');
    const response = result(200);
    response.cookies.set(sessionCookie, token, { ...sessionOptions, maxAge: sessionAge });
    return response;
  } catch {
    console.error("Falha no serviço de autenticação de revendedores.");
    return result(503, "A entrada está indisponível. Tente novamente em alguns minutos.");
  }
}
