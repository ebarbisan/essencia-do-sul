import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./chrome";
import { menuUrl, siteOrigin } from "../lib/site";
import hero from "../public/imagens/hero.jpg";
import rose from "../public/imagens/rose.jpg";
import wines from "../public/imagens/vinhos.jpg";
import sparkling from "../public/imagens/espumantes.jpg";
import juices from "../public/imagens/sucos.jpg";

export const metadata: Metadata = {
  alternates: siteOrigin() ? { canonical: "/" } : undefined,
};

const catalog = [
  { title: "Vinhos", image: wines, alt: "Três garrafas de vinho fino Vanisul", detail: "Vinhos de mesa secos e suaves, além de rótulos finos como Merlot, Tannat, Cabernet Sauvignon, Chardonnay e Moscato Giallo." },
  { title: "Espumantes", image: sparkling, alt: "Garrafa de espumante Moscatel Rosé Vanisul", detail: "Brut e Moscatel Rosé. Duas maneiras de servir borbulhas à mesa." },
  { title: "Sucos de uva", image: juices, alt: "Garrafas de suco de uva branco e tinto Vanisul", detail: "Integrais nas versões tinto, branco e rosé. Uma escolha para servir gelada." },
];

export default function Home() {
  return <main id="conteudo" tabIndex={-1}>
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">O Sul à <em>sua mesa.</em></h1>
        <p>Do vinho de mesa ao suco de uva rosé, conheça a seleção Vanisul da Essência do Sul. Para abrir num almoço de domingo ou levar de presente.</p>
        <div className="actions">
          <Link href="#catalogo" className="button">Explorar catálogo <Arrow /></Link>
          <a href={menuUrl} className="text-link">Abrir cardápio <Arrow diagonal /></a>
        </div>
      </div>
      <figure className="hero-photo">
        <Image src={hero} alt="Sucos Vanisul rosé, branco e tinto lado a lado" fill preload sizes="(max-width: 760px) 100vw, 55vw" />
        <figcaption>Da esquerda para a direita: rosé, branco e tinto.</figcaption>
      </figure>
    </section>

    <section className="catalog section shell" id="catalogo" aria-labelledby="catalog-title">
      <div className="section-head">
        <h2 id="catalog-title">O que vai à mesa</h2>
        <p>Vinhos, espumantes e sucos. Encontre a sua escolha e consulte a disponibilidade no cardápio.</p>
      </div>
      <ul className="catalog-grid">
        {catalog.map(({ title, image, alt, detail }) => <li key={title}>
          <div className="product-photo"><Image src={image} alt={alt} fill sizes="(max-width: 600px) 94vw, (max-width: 900px) 30vw, 360px" /></div>
          <h3>{title}</h3>
          <p>{detail}</p>
        </li>)}
      </ul>
      <a className="text-link" href={menuUrl}>Consultar cardápio completo <Arrow diagonal /></a>
    </section>

    <section className="feature" aria-labelledby="rose-title">
      <div className="shell feature-inner">
        <div className="feature-photo"><Image src={rose} alt="Garrafa de 1,5 litro do suco de uva rosé integral Vanisul" fill sizes="(max-width: 760px) 92vw, 43vw" /></div>
        <div className="feature-copy">
          <h2 id="rose-title">Suco de uva <em>rosé.</em></h2>
          <p>Um rosé para quem quer suco. Integral, sem adição de açúcar e em garrafa de 1,5 litro. Sirva gelado no almoço ou no lanche da tarde.</p>
          <a className="button button-light" href={menuUrl}>Encontrar no cardápio <Arrow diagonal /></a>
        </div>
      </div>
    </section>

    <section className="about shell section" id="sobre" aria-labelledby="about-title">
      <div className="section-head">
        <h2 id="about-title">Essência do Sul</h2>
        <p>Uma seleção de bebidas Vanisul para quem gosta de descobrir novos rótulos e de voltar aos seus favoritos.</p>
      </div>
      <dl className="principles">
        <div><dt>Missão</dt><dd>Valorizar a cultura vitivinícola do Sul e aproximar seus sabores de quem aprecia bebidas de uva.</dd></div>
        <div><dt>Visão</dt><dd>Ser referência nacional em produtos de uva, com espaço para tradição e inovação.</dd></div>
        <div><dt>Valores</dt><dd>Qualidade artesanal, sustentabilidade, respeito à tradição, inovação e transparência.</dd></div>
      </dl>
    </section>

    <section className="trade shell" aria-labelledby="trade-title">
      <div><h2 id="trade-title">Quer revender?</h2><p>Conte um pouco sobre o seu negócio e deixe um contato para retorno.</p></div>
      <div className="actions">
        <Link className="button" href="/revendedor/solicitar">Solicitar revenda <Arrow /></Link>
        <Link className="text-link" href="/revendedor/login">Já tenho acesso <Arrow /></Link>
      </div>
    </section>
  </main>;
}
