import { z } from "zod";

const contact = z.string().trim().min(5).max(254).refine((value) => {
  if (z.email().safeParse(value).success) return true;
  const digits = value.replace(/\D/g, "");
  return /^\+?[\d ().-]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
});

export const requestSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  cidade: z.string().trim().min(2).max(100),
  contato: contact,
  documento: z.string().trim().max(24).regex(/^[a-zA-Z0-9./ -]*$/).optional().default(""),
  mensagem: z.string().trim().max(1000).optional(),
});

export const emailSchema = z.string().trim().toLowerCase().max(254).pipe(z.email());
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).refine((value) => Buffer.byteLength(value) <= 72),
});
