import type { Metadata } from "next";
import { siteOrigin } from "../lib/site";
import { Footer, Header } from "./chrome";
import '@fontsource-variable/fraunces';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/dm-sans';
import './globals.css';

const origin = siteOrigin();

export const metadata: Metadata = {
  metadataBase: origin ? new URL(origin) : undefined,
  title: { default: "Essência do Sul | Vinhos, espumantes e sucos de uva", template: "%s | Essência do Sul" },
  description: "Conheça a seleção Vanisul da Essência do Sul, do vinho de mesa ao suco de uva rosé integral. Consulte o cardápio e saiba como revender.",
  openGraph: {
    type: "website",
    siteName: "Essência do Sul",
    locale: "pt_BR",
    ...(origin ? { url: origin, images: [{ url: "/imagens/hero.jpg", alt: "Sucos de uva Vanisul" }] } : {}),
  },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR">
    <body>
      <Header />
      {children}
      <Footer />
    </body>
  </html>;
}
