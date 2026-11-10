import type { Metadata } from "next";
import Link from "next/link";
import { sessionUser } from "../../lib/auth";
import { database } from "../../lib/prisma";
import { contactUrl, menuUrl } from "../../lib/site";
import { Arrow } from "../chrome";

export const metadata: Metadata = { title: "Área de revendedores", robots: { index: false } };

const statusLabel = { PENDENTE: "Pendente", APROVADO: "Aprovado", REJEITADO: "Rejeitado" };

async function Queue() {
  const requests = await database().revendedorRequest.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 50,
    select: { id: true, nome: true, cidade: true, contato: true, mensagem: true, status: true, createdAt: true },
  });
  return <section aria-labelledby="queue-title">
    <h2 id="queue-title">Solicitações recentes</h2>
    {requests.length ? <ul className="request-list">
      {requests.map((entry) => <li key={entry.id}>
        <strong>{entry.nome}</strong><p>{entry.cidade} · {entry.contato}</p>
        <p>{statusLabel[entry.status]} · {entry.createdAt.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}</p>
        {entry.mensagem && <p>{entry.mensagem}</p>}
      </li>)}
    </ul> : <p>Nenhuma solicitação recebida.</p>}
  </section>;
}

export default async function Reseller() {
  let user;
  try {
    user = await sessionUser();
  } catch {
    return <main id="conteudo" tabIndex={-1} className="subpage">
      <h1>Área de revendedores</h1>
      <p>O acesso está temporariamente indisponível. Tente novamente em alguns minutos.</p>
    </main>;
  }

  return <main id="conteudo" tabIndex={-1} className="subpage">
    <h1>Área de revendedores</h1>
    {user ? <>
      <p>Olá, {user.name}.</p>
      <div className="actions">
        <a className="button" href={menuUrl}>Consultar cardápio <Arrow diagonal /></a>
        <a className="text-link" href={contactUrl}>Falar com a equipe <Arrow diagonal /></a>
      </div>
      {user.role === "ADMIN" && <Queue />}
      <form className="mt-6" action="/api/revendedor/logout" method="post"><button className="text-link" type="submit">Sair da minha conta</button></form>
    </> : <>
      <p>Já recebeu seu acesso? Entre com sua conta. Se quer revender, conte à equipe um pouco sobre o seu negócio.</p>
      <div className="actions">
        <Link className="button" href="/revendedor/solicitar">Solicitar revenda <Arrow /></Link>
        <Link className="text-link" href="/revendedor/login">Já tenho acesso <Arrow /></Link>
      </div>
    </>}
  </main>;
}
