"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Send, CheckCircle, AlertCircle, Loader2, ChevronDown } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { WEB3FORMS_KEY } from "@/lib/constants";
import { trackEvent, EVENTS } from "@/lib/analytics";

type FormStatus = "idle" | "sending" | "success" | "error";

const ROLES = [
  { value: "empresa", label: "Empresa / establecimiento" },
  { value: "consultor", label: "Consultor o estudio de SyH" },
  { value: "independiente", label: "Profesional independiente" },
  { value: "otro", label: "Otro" },
];

// Rangos alineados al árbol de clasificación de la guía interna de pricing:
// hasta 50/60 → Profesional, hasta 250 → Empresa Starter, hasta 1.000 →
// Empresa Advanced, más de 1.000 → Enterprise.
const EQUIPOS = [
  "Hasta 50",
  "50-250",
  "250-1.000",
  "Más de 1.000",
  "No sé todavía",
];

const selectClasses =
  "w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 [&>option]:bg-primary [&:invalid]:text-white/30";

function SelectChevron() {
  return (
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
  );
}

export default function CTAFinal() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [rol, setRol] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const rolValue = (data.get("rol") as string) || "otro";
    const equipos = (data.get("equipos") as string) || "";
    const subjectTag =
      rolValue === "empresa" && equipos && equipos !== "No sé todavía"
        ? `[EMPRESA | ${equipos} equipos]`
        : `[${rolValue.toUpperCase()}]`;

    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", `${subjectTag} Contacto SHIPSAFE`);
    data.append("from_name", "SHIPSAFE Landing");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      if (json.success) {
        setStatus("success");
        trackEvent(EVENTS.GENERATE_LEAD, {
          lead_segment: rolValue,
          equipment_range: equipos,
          form: "contacto",
        });
        setRol("");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(json.message || "Error al enviar. Intentá de nuevo.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión. Intentá de nuevo.");
    }
  }

  return (
    <section id="contacto" className="relative overflow-hidden py-20 lg:py-28">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur" duration={0.8}>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Digitalizá tu gestión de seguridad e higiene hoy
            </h2>
            <p className="mt-4 text-lg text-white/75">
              Dejanos tus datos y te contactamos para mostrarte cómo funciona
              SHIPSAFE en tu operación.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} variant="slideUp">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 rounded-2xl border border-accent/20 bg-accent/5 px-6 py-10 text-center backdrop-blur-sm"
            >
              <CheckCircle className="mx-auto h-12 w-12 text-accent" />
              <h3 className="mt-4 text-xl font-semibold text-white">
                ¡Mensaje enviado!
              </h3>
              <p className="mt-2 text-white/70">
                Te contactamos pronto. Si necesitás algo urgente, escribinos por
                WhatsApp.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm font-medium text-accent underline underline-offset-2 transition-colors hover:text-accent/80"
              >
                Enviar otro mensaje
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 backdrop-blur-sm sm:px-10 sm:py-10"
            >
              {/* Honeypot */}
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-white/80"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Tu nombre"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-white/80"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="tu@empresa.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="rol"
                    className="mb-1.5 block text-sm font-medium text-white/80"
                  >
                    ¿Quién sos?
                  </label>
                  <div className="relative">
                    <select
                      id="rol"
                      name="rol"
                      required
                      value={rol}
                      onChange={(e) => setRol(e.target.value)}
                      className={selectClasses}
                    >
                      <option value="" disabled>
                        Elegí una opción
                      </option>
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <SelectChevron />
                  </div>
                  {(rol === "consultor" || rol === "independiente") && (
                    <p className="mt-2 text-xs text-white/60">
                      ¿Gestionás varios clientes? Mirá el{" "}
                      <Link
                        href="/consultores"
                        className="font-medium text-accent underline underline-offset-2 hover:text-accent/80"
                      >
                        Programa de Consultores
                      </Link>
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="equipos"
                    className="mb-1.5 block text-sm font-medium text-white/80"
                  >
                    Equipos a controlar
                  </label>
                  <div className="relative">
                    <select
                      id="equipos"
                      name="equipos"
                      required
                      defaultValue=""
                      className={selectClasses}
                    >
                      <option value="" disabled>
                        Matafuegos, tableros, máquinas...
                      </option>
                      {EQUIPOS.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                    <SelectChevron />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="mb-1.5 block text-sm font-medium text-white/80"
                >
                  Empresa{" "}
                  <span className="text-white/40">(opcional)</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  placeholder="Nombre de tu empresa"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-white/80"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Contanos qué necesitás o qué te gustaría saber sobre SHIPSAFE"
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
                />
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={status === "sending"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:shadow-xl hover:shadow-accent/40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-70"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar mensaje
                    </>
                  )}
                </span>
              </motion.button>

              <p className="text-center text-xs text-white/40">
                Te respondemos en menos de 24 horas
              </p>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
