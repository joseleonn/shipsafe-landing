/**
 * Página /mx: la que comparte Hugo Ayón (Lemniscus), partner de SHIPSAFE en
 * México, en WhatsApp, Facebook y LinkedIn (2/11/2026).
 *
 * Reglas de esta página:
 *  - Español neutro, como la home. Nada de normativa argentina (SRT, RGRL,
 *    Res. 299): en México rigen las NOM de la STPS, y no se cita ninguna sin
 *    verificarla antes.
 *  - Hugo va como "partner", nunca como "representante oficial": eso queda
 *    para cuando haya acuerdo firmado (claude/partners-shipsafe).
 *  - El partner abre la puerta y está en la reunión; la demo la hace José.
 *  - Atribución: si alguien entra sin UTM, se le ponen los de Hugo
 *    (UTM_DEFAULTS). Así cada lead y cada reunión de Calendly que salga de
 *    esta página queda registrada como suya en HubSpot, que es lo que pide la
 *    regla de registro de oportunidades del canal.
 */
import { HOME5 } from "@/lib/home-v5";

export const UTM_DEFAULTS = {
  utm_source: "partner-hugo",
  utm_medium: "partner",
  utm_campaign: "mexico",
} as const;

const HUGO = HOME5.nosotros.partners[0];

export const MX = {
  meta: {
    title: "SHIPSAFE en México | Seguridad y salud en el trabajo para tu operación",
    description:
      "Inspecciones, desvíos, entrega de EPP, permisos de trabajo y accidentes de todas tus plantas en una sola plataforma. En México te atiende Hugo Ayón, de Lemniscus.",
  },
  hero: {
    eyebrow: "SHIPSAFE en México",
    lede: "Una sola plataforma para todas tus plantas, sedes y equipos de campo. En México te atiende Hugo Ayón, de Lemniscus.",
    secondary: { href: "#contacto-mx", label: "Conoce a Hugo", icon: "user" as const },
  },
  contacto: {
    h2: "Tu contacto",
    h2Accent: "en México.",
    persona: HUGO,
    rol: "Partner de SHIPSAFE en México",
    empresa: "Lemniscus · Jalisco",
    texto:
      "Lemniscus hace mantenimiento industrial y capacitación en seguridad. En la reunión estamos Hugo y José: te mostramos SHIPSAFE con tu operación y te pasamos la propuesta el mismo día.",
    cta: "Agenda con Hugo y José",
  },
};
