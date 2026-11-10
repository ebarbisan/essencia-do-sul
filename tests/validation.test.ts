import assert from "node:assert/strict";
import test from "node:test";
import { readJson } from "../lib/http";
import { loginSchema, requestSchema } from "../lib/validation";

test("normaliza o pedido e elimina status, identificadores e campos não autorizados", () => {
  const parsed = requestSchema.parse({
    nome: "  Loja de teste ", cidade: " Campinas ", contato: " loja@example.test ",
    status: "APROVADO", id: 999, role: "ADMIN",
  });
  assert.deepEqual(parsed, {
    nome: "Loja de teste", cidade: "Campinas", contato: "loja@example.test", documento: "",
  });
});

test("aceita telefone e documento legado, valida obrigatórios e limita a mensagem", () => {
  const valid = { nome: "Loja de teste", cidade: "Campinas", contato: "+55 (19) 99999-9999" };
  assert.equal(requestSchema.safeParse({ ...valid, documento: "00.000.000/0001-00" }).success, true);
  assert.equal(requestSchema.safeParse({ ...valid, cidade: " " }).success, false);
  assert.equal(requestSchema.safeParse({ ...valid, contato: "sem contato" }).success, false);
  assert.equal(requestSchema.safeParse({ ...valid, mensagem: "a".repeat(1001) }).success, false);
});

test("normaliza e-mail e impede truncamento silencioso de senha no bcrypt", () => {
  assert.equal(loginSchema.parse({ email: " TESTE@EXAMPLE.TEST ", password: "senha" }).email, "teste@example.test");
  assert.equal(loginSchema.safeParse({ email: "teste@example.test", password: "é".repeat(37) }).success, false);
});

test("leitor exige JSON válido e limita o tamanho mesmo sem content-length", async () => {
  function request(body: string, type = "application/json") {
    return new Request("http://localhost", { method: "POST", body, headers: { "Content-Type": type } });
  }
  assert.deepEqual(await readJson(request('{"ok":true}')), { ok: true });
  assert.equal(await readJson(request("{")), null);
  assert.equal(await readJson(request("[]", "text/plain")), null);
  assert.equal(await readJson(request(JSON.stringify("a".repeat(9000)))), null);
});
