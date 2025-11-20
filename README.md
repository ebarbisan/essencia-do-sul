# Projeto — Essência do Sul 🍇

Este repositório contém o desenvolvimento do site institucional **Essência do Sul**, uma marca de vinhos, espumantes e sucos de uva do Rio Grande do Sul. O objetivo deste projeto é entregar uma experiência digital elegante, moderna e funcional, representando a identidade da empresa e oferecendo recursos essenciais para clientes e revendedores.

---

## ✨ Sobre o Projeto

O site foi desenvolvido para apresentar a história da marca, seus produtos e seus diferenciais, com foco na simplicidade e na identidade visual da empresa. Não há valores exibidos, pois o cliente utiliza um menu externo para vendas.

A plataforma também inclui uma área exclusiva para revendedores, permitindo que parceiros solicitem acesso e acompanhem informações relevantes.

---

## 🚀 Tecnologias Utilizadas

* **Next.js** — Framework React de alta performance
* **TailwindCSS** — Estilização rápida e responsiva
* **Prisma ORM** — Gerenciamento de banco de dados com tipagem
* **PostgreSQL** — Banco de dados seguro e robusto
* **TypeScript** — Tipagem estática para maior confiabilidade
* **MyAirGo** — Integração com o menu online da empresa

---

## 🎨 Identidade Visual

O layout utiliza duas tonalidades principais:

* **Laranja claro** (cor de fundo)
* **Laranja escuro** (cor de destaque)

Essas cores reforçam a personalidade vibrante e calorosa da marca.

---

## 🔗 Funcionalidades

* Página institucional completa
* Exibição de catálogo de produtos (sem preços)
* Seção de missão, visão e valores
* Integração direta com o menu **MyAirGo**
* Área de revendedores com acesso restrito
* Formulário para interessados se tornarem revendedores

---

## 📦 Como Rodar o Projeto

```bash
# Instalar dependências
yarn install

# Executar em modo desenvolvimento
yarn dev

# Gerar build de produção
yarn build
yarn start
```

Certifique-se de configurar o arquivo `.env` com os dados do PostgreSQL e variáveis necessárias para autenticação.

---

## 🗄️ Configuração do Banco de Dados

```bash
npx prisma migrate dev
npx prisma generate
```

O Prisma cuida da estrutura e mantém o banco versionado.

---

## 📁 Estrutura do Projeto (resumo)

```
├── prisma
├── public
├── src
│   ├── app
│   ├── components
│   ├── lib
│   └── styles
└── README.md
```

---

## 🔥 Próximos Passos

* Painel exclusivo para revendedores
* Sistema interno de notificações
* Análises de visitas e insights
* SEO avançado para melhor posicionamento

---

## 👨‍💻 Autor

Projeto desenvolvido por **[Seu Nome]**, apaixonado por tecnologia, soluções eficientes e experiências digitais modernas.

---

## 📬 Contato

Disponível para projetos, parcerias e novas ideias.

* Email: [seuemail@exemplo.com](mailto:seuemail@exemplo.com)
* GitHub: [https://github.com/ebarbisan](https://github.com/seuusuario)
* LinkedIn: [http://www.linkedin.com/in/estevan-barbisan-a96881140](https://linkedin.com/in/seuperfil)

---

Obrigado pela visita ao repositório! 🍷
