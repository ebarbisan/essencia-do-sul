import type { Metadata } from "next";
import Link from "next/link";
import { contactUrl, siteOrigin } from "../../../lib/site";
import { Arrow } from "../../chrome";
import { ResellerForm } from "../form";

export const metadata: Metadata = {
  title: "Solicitar revenda",
  description: "Apresente seu negócio à Essência do Sul e solicite acesso para revender vinhos, espumantes e sucos de uva.",
  alternates: siteOrigin() ? { canonical: "/revendedor/solicitar" } : undefined,
};

export default function Apply() {
  return <main id="conteudo" tabIndex={-1} className="subpage">
    <Link className="text-link" href="/revendedor">Área de revendedores</Link>
    <h1>Solicitar revenda</h1>
    <p>Deixe um contato e conte onde você pretende oferecer os produtos.</p>
    <ResellerForm />
    <p className="mt-5"><a className="text-link" href={contactUrl}>Falar pelo WhatsApp <Arrow diagonal /></a></p>
  </main>;
}
