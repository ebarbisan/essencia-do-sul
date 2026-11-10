import type { Metadata } from "next";
import Link from "next/link";
import { contactUrl } from "../../../lib/site";
import { Arrow } from "../../chrome";
import { ResellerForm } from "../form";

export const metadata: Metadata = { title: "Entrar na área de revenda", robots: { index: false } };

export default function Login() {
  return <main id="conteudo" tabIndex={-1} className="subpage">
    <Link href="/revendedor" className="text-link">Área de revendedores</Link>
    <h1>Entrar</h1>
    <p>Use o e-mail e a senha cadastrados pela equipe da Essência do Sul.</p>
    <ResellerForm login />
    <p className="mt-5"><a className="text-link" href={contactUrl}>Preciso de ajuda com meu acesso <Arrow diagonal /></a></p>
  </main>;
}
