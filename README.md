# Essência do Sul

Site institucional e catálogo público da seleção Vanisul. A página usa as fotos enviadas para o projeto. O cardápio e os canais de contato foram identificados no [perfil da Essência do Sul no MeuAirGo](https://meuairgo.com.br/essenciadosul). Missão, visão e valores foram adaptados do texto do projeto original para revisão da marca antes de publicar.

## Rodar no Windows

Use Node.js 24 LTS e abra o PowerShell na pasta que contém o `package.json`.

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Abra [o site local](http://localhost:3000). A landing e o catálogo funcionam sem PostgreSQL. Para testar os formulários e o login, configure o banco antes de iniciar o servidor.

## Banco e acesso de revendedores

1. Crie um banco PostgreSQL **exclusivo para desenvolvimento**. Configure `DATABASE_URL` no arquivo `.env` e mantenha `SITE_URL` com o mesmo endereço que você usa no navegador, incluindo a porta. Se o provedor separar a conexão direta da conexão por pool, use `DIRECT_URL` para migrações.
2. Gere uma chave exclusiva de 32 bytes para `RATE_LIMIT_SECRET` e salve-a no `.env`. Guarde-a fora do Git. O comando abaixo gera uma chave local.
3. Rode `npm run db:deploy` para criar o esquema no banco vazio. Suba o servidor com `npm run dev`.
4. Crie acessos individualmente. Revendedores veem o catálogo e os canais de atendimento. Administradores também veem as 50 solicitações mais recentes. O envio registra o pedido como pendente e a equipe faz o retorno pelo contato informado. A decisão e o provisionamento continuam manuais.

```powershell
[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Em uma sessão administrativa do PowerShell, ajuste os dados abaixo. Use `ADMIN` apenas para a equipe autorizada.

```powershell
$env:ACCOUNT_EMAIL = 'revendedor@example.test'
$env:ACCOUNT_NAME = 'Nome da conta'
$env:ACCOUNT_ROLE = 'REVENDEDOR'
$env:ACCOUNT_PASSWORD = Read-Host 'Senha exclusiva de 16 a 72 bytes' -MaskInput
try { npm run db:account } finally { Remove-Item Env:ACCOUNT_PASSWORD }
```

Para reativar uma conta legada com uma senha nova, informe o papel atual e rode `npm run db:account -- --rotate` dentro do bloco acima. A rotação encerra as sessões existentes. As contas legadas começam desativadas. O antigo seed continha uma credencial fixa. Se ela já foi usada em outro ambiente, rotacione-a também lá.

### Se já existir um banco com dados

Trabalhe primeiro numa cópia restaurada de um backup. Compare o esquema real com a migração `20261110090000_baseline`, que representa as três tabelas e os dois enums do esquema recuperado. Se forem equivalentes e essa base ainda não tiver histórico de migração, registre-a como aplicada com `npx prisma migrate resolve --applied 20261110090000_baseline`. Em seguida, aplique a migração aditiva com `npm run db:deploy`. Em bancos com histórico ou diferenças, reconcilie o esquema antes de executar esses passos.

A API antiga gravava em `data/revendedores.json`. A cópia inspecionada não tinha esse arquivo. Se você tiver uma cópia histórica, preserve-a fora do repositório e planeje a importação validada para PostgreSQL. Nenhum seed de produto é necessário para o catálogo público.

## Verificação

```powershell
npm test
npm run lint
npm run typecheck
npm run db:validate
npm run build
npm audit --omit=dev
```

Com o servidor rodando, use `npx playwright install chromium` e `npm run test:browser`. Defina `TEST_URL` para uma porta alternativa ou `EDGE_PATH` para usar uma instalação local do Edge. O teste de integração opcional precisa de um banco descartável e das contas `admin@example.test` e `revendedor@example.test`. Passe as senhas via `TEST_ADMIN_PASSWORD` e `TEST_RESELLER_PASSWORD`. Ele insere pedidos fictícios e testa o bloqueio após tentativas de login. Use `TEST_PRODUCTION=1` para verificar também o cookie seguro no servidor de produção.

## GitHub e Vercel

O projeto fica na raiz do repositório. A Vercel usa o preset Next.js, Node.js 24 e o comando `npm run build`. O build gera o cliente Prisma e as páginas públicas sem consultar o banco.

Para visualizar, abra o deploy correspondente à branch no painel da Vercel. Para ativar login e pedidos, configure `DATABASE_URL`, `RATE_LIMIT_SECRET` e `SITE_URL` no ambiente correspondente e aplique as migrações fora do build. Use um banco de teste independente para o ambiente Preview.

## Antes da publicação

- Revise a redação institucional com a equipe e confirme o canal responsável pelo retorno e o período de retenção dos pedidos.
- Configure `SITE_URL` com a origem HTTPS pública no momento do build e da execução. Isso habilita URL canônica, sitemap e a verificação de origem dos formulários. Use o mesmo domínio para as páginas e a API.
- Use um banco separado por ambiente e uma conta de execução com privilégios restritos. Em produção, execute migrações com credenciais próprias para DDL e use uma conexão com TLS conforme o provedor.
- Monitore respostas 429 e falhas de armazenamento. A aplicação limita globalmente os envios e os logins e impõe limite adicional por e-mail para autenticação. Em exposição pública, use a proteção de tráfego do seu provedor para limitar abuso distribuído e monitore a limpeza de registros expirados de rate limit. O CSP bloqueia enquadramento, plugins e formulários externos. Uma política completa de scripts exige validação com a configuração de hospedagem.
