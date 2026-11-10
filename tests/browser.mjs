import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const url = process.env.TEST_URL ?? "http://localhost:3000";
const browser = await chromium.launch({
  ...(process.env.EDGE_PATH ? { executablePath: process.env.EDGE_PATH } : {}),
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1050 } });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

try {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "O Sul à sua mesa." }).waitFor();
  assert.equal(await page.getByRole("link", { name: "Abrir cardápio" }).getAttribute("href"), "https://meuairgo.com.br/essenciadosul");
  assert.equal(await page.locator('main').innerText().then((text) => text.includes("R$")), false);
  assert.equal(await page.locator(".hero-photo img").evaluate((img) => img.complete && img.naturalWidth > 0), true);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href", { timeout: 2000 }).catch(() => null);
  if (canonical) assert.equal(new URL(canonical).origin, new URL(url).origin);
  const metrics = await page.evaluate(() => {
    const paint = performance.getEntriesByName("first-contentful-paint")[0];
    const image = performance.getEntriesByName(document.querySelector(".hero-photo img").currentSrc)[0];
    return { fcpMs: Math.round(paint?.startTime ?? 0), heroKiB: Math.round((image?.decodedBodySize ?? 0) / 1024) };
  });
  console.log("Amostra local, desktop sem limitação de rede:", metrics);
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").innerText(), "Ir para o conteúdo");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(":focus").getAttribute("id"), "conteudo");
  const axe = () => new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  const desktop = await axe();
  assert.deepEqual(desktop.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target }) => target) })), []);

  const preview = process.env.TEST_SCREENSHOTS;
  if (preview) {
    await mkdir(preview, { recursive: true });
    await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement.blur(); });
    await page.screenshot({ path: preview + "/desktop.png", fullPage: true });
  }
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, "largura " + width);
    if (preview && width === 390) await page.screenshot({ path: preview + "/celular.png", fullPage: true });
  }
  await page.getByRole("link", { name: "Solicitar revenda" }).click();
  await page.getByRole("heading", { name: "Solicitar revenda" }).waitFor();
  const mobileForm = await axe();
  assert.deepEqual(mobileForm.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target }) => target) })), []);
  await page.goto(url + "/produtos");
  assert.equal(new URL(page.url()).hash, "#catalogo");
  assert.deepEqual(errors, []);
  console.log("Landing, imagens, foco, catálogo legado e acessibilidade passaram em desktop e celular.");

  if (process.env.TEST_ADMIN_PASSWORD && process.env.TEST_RESELLER_PASSWORD) {
    const origin = new URL(url).origin;
    const request = (data, headers = { Origin: origin }) => page.request.post(url + "/api/revendedor", { data, headers });
    assert.equal((await page.request.get(url + "/api/revendedor")).status(), 405);
    assert.equal((await request({}, { Origin: "https://externo.example" })).status(), 403);
    assert.equal((await request({ nome: "A", contato: "x" })).status(), 400);

    const name = "Loja " + Date.now();
    await page.goto(url + "/revendedor/solicitar");
    await page.getByLabel("Nome ou empresa").fill(name);
    await page.getByLabel("Cidade").fill("Campinas");
    await page.getByLabel("Telefone ou e-mail").fill("contato@example.test");
    await page.getByLabel("Conte um pouco").fill("Teste em banco isolado");
    await page.getByRole("button", { name: "Enviar solicitação" }).click();
    await page.getByText("Solicitação recebida.", { exact: false }).waitFor();

    const forgedName = "Pedido com status forjado " + Date.now();
    assert.equal((await request({
      nome: forgedName, cidade: "Campinas", contato: "outro@example.test", status: "APROVADO",
    })).status(), 200);

    async function login(email, password) {
      await page.goto(url + "/revendedor/login");
      await page.getByLabel("E-mail").fill(email);
      await page.getByLabel("Senha").fill(password);
      await page.getByRole("button", { name: "Entrar", exact: true }).click();
      await page.getByRole("button", { name: "Sair da minha conta" }).waitFor();
    }
    await login("revendedor@example.test", process.env.TEST_RESELLER_PASSWORD);
    assert.equal(await page.getByText(name).count(), 0);
    assert.equal(await page.getByRole("heading", { name: "Solicitações recentes" }).count(), 0);
    await page.getByRole("button", { name: "Sair da minha conta" }).click();
    await page.getByRole("heading", { name: "Entrar", exact: true }).waitFor();

    await login("admin@example.test", process.env.TEST_ADMIN_PASSWORD);
    await page.getByText(name, { exact: true }).waitFor();
    assert.match(await page.locator("li").filter({ hasText: forgedName }).innerText(), /Pendente/);
    const cookie = (await page.context().cookies()).find(({ name }) => name.endsWith("essencia-session"));
    assert.equal(cookie?.httpOnly, true);
    if (process.env.TEST_PRODUCTION) assert.equal(cookie?.secure, true);
    assert.equal((await page.request.post(url + "/api/revendedor/logout", { headers: { Origin: "https://externo.example" } })).status(), 403);
    await page.getByRole("button", { name: "Sair da minha conta" }).click();
    await page.goto(url + "/revendedor");
    assert.equal(await page.getByRole("heading", { name: "Solicitações recentes" }).count(), 0);
    const oldSession = await page.request.get(url + "/revendedor", { headers: { Cookie: cookie.name + "=" + cookie.value } });
    assert.equal((await oldSession.text()).includes(name), false);

    for (let attempt = 1; attempt <= 9; attempt++) {
      const response = await page.request.post(url + "/api/revendedor/login", {
        data: { email: "rate-" + name.split(" ")[1] + "@example.test", password: "errada" }, headers: { Origin: origin },
      });
      assert.equal(response.status(), attempt <= 8 ? 401 : 429);
    }
    assert.deepEqual(errors, []);
    console.log("Integração passou: envio, validação, origem, papéis, cookie, revogação e limite de tentativas.");
  }
} finally {
  await browser.close();
}
