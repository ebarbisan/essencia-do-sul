"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type Field = {
  name: string;
  label: string;
  maxLength: number;
  type?: "email" | "password" | "text" | "textarea";
  autoComplete?: string;
  optional?: boolean;
};

export function ResellerForm({ login = false }: { login?: boolean }) {
  const fields: Field[] = login ? [
    { name: "email", label: "E-mail", type: "email", autoComplete: "username", maxLength: 254 },
    { name: "password", label: "Senha", type: "password", autoComplete: "current-password", maxLength: 72 },
  ] : [
    { name: "nome", label: "Nome ou empresa", autoComplete: "organization", maxLength: 120 },
    { name: "cidade", label: "Cidade", autoComplete: "address-level2", maxLength: 100 },
    { name: "contato", label: "Telefone ou e-mail", maxLength: 254 },
    { name: "mensagem", label: "Conte um pouco sobre o seu negócio (opcional)", type: "textarea", optional: true, maxLength: 1000 },
  ];

  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState({ error: false, message: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    setPending(true);
    setFeedback({ error: false, message: "" });

    try {
      const response = await fetch(login ? "/api/revendedor/login" : "/api/revendedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();
      if (!response.ok) {
        setFeedback({ error: true, message: result.error ?? "Tente novamente em alguns minutos." });
      } else if (login) {
        router.replace('/revendedor');
        router.refresh();
      } else {
        form.reset();
        setFeedback({ error: false, message: "Solicitação recebida. Usaremos o contato informado para falar com você." });
      }
    } catch {
      setFeedback({ error: true, message: "Não foi possível concluir. Verifique sua conexão e tente novamente." });
    } finally {
      setPending(false);
    }
  }

  return <form className="form" method="post" onSubmit={submit}>
    {fields.map(({ name, label, type = "text", maxLength, autoComplete, optional }) => <div className="field" key={name}>
      <label htmlFor={name}>{label}</label>
      {type === "textarea"
        ? <textarea id={name} name={name} rows={4} maxLength={maxLength} />
        : <input id={name} name={name} type={type} autoComplete={autoComplete} required={!optional} maxLength={maxLength} />}
    </div>)}
    {!login && <p className="form-note">Os dados serão usados para analisar seu pedido e entrar em contato. Evite incluir documentos ou dados sensíveis na mensagem.</p>}
    <button className="button" disabled={pending}>{pending ? "Aguarde…" : login ? "Entrar" : "Enviar solicitação"}</button>
    <div aria-live="polite" aria-atomic="true">
      <p className="form-message" data-error={feedback.error}>{feedback.message}</p>
    </div>
  </form>;
}
