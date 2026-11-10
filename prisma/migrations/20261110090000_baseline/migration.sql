CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'REVENDEDOR');
CREATE TYPE "RequestStatus" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO');

CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'REVENDEDOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "RevendedorRequest" (
    "id" SERIAL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "mensagem" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Product" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "desc" TEXT,
    "image" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false
);
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
