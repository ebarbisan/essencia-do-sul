export const menuUrl = "https://meuairgo.com.br/essenciadosul";
export const contactUrl = "https://api.whatsapp.com/send?phone=5519920001105";
export const instagramUrl = "https://instagram.com/essencia_do_sul";

export function siteOrigin() {
  try {
    const url = new URL(process.env.SITE_URL ?? "");
    return ["https:", "http:"].includes(url.protocol) ? url.origin : undefined;
  } catch {
    return undefined;
  }
}
