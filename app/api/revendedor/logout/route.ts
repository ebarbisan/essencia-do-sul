import { NextResponse, type NextRequest } from "next/server";
import { revokeSession, sessionCookie, sessionOptions } from "../../../../lib/auth";
import { result, sameOrigin } from "../../../../lib/http";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return result(403, "Origem da solicitação inválida.");
  try {
    await revokeSession(request.cookies.get(sessionCookie)?.value);
  } catch {
    return result(503, "Não foi possível encerrar a sessão. Tente novamente.");
  }
  const response = new NextResponse(null, {
    status: 303,
    headers: { Location: "/revendedor/login", "Cache-Control": "no-store" },
  });
  response.cookies.set(sessionCookie, "", { ...sessionOptions, maxAge: 0 });
  return response;
}
