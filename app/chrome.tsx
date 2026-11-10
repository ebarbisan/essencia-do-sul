import Link from "next/link";
import { instagramUrl, menuUrl } from "../lib/site";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d={diagonal ? "M6 18 18 6M8 6h10v10" : "M4 12h15m-6-6 6 6-6 6"} />
  </svg>;
}

function Wordmark() {
  return <Link href="/" className="wordmark">
    <svg aria-hidden="true" viewBox="0 0 38 42" width="38" height="42" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M19 2C9 2 3 10 3 20v19h32V20C35 10 29 2 19 2Z" />
      <path d="M7 30c7-7 14-7 24 0M7 35c8-6 16-6 24 0M19 23v-8m0 4c-4 0-6-3-6-6 4 0 6 3 6 6Zm0-3c0-4 3-6 6-6 0 4-2 6-6 6Z" />
    </svg>
    <span>Essência <i>do Sul</i></span>
  </Link>;
}

export function Header() {
  return <header className="topbar">
    <a className="skip" href="#conteudo">Ir para o conteúdo</a>
    <div className="shell header-inner">
      <Wordmark />
      <nav aria-label="Principal">
        <Link href="/#catalogo">Catálogo</Link>
        <Link href="/#sobre">Sobre</Link>
        <Link href="/revendedor">Revendedores</Link>
      </nav>
      <a className="menu-link" href={menuUrl}>Cardápio <Arrow diagonal /></a>
    </div>
  </header>;
}

export function Footer() {
  return <footer className="footer">
    <div className="shell footer-inner">
      <Wordmark />
      <p>Vinhos, espumantes e sucos de uva.</p>
      <a className="text-link" href={instagramUrl}>Instagram <Arrow diagonal /></a>
    </div>
  </footer>;
}
