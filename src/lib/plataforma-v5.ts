/**
 * Copy de /plataforma (v5, 25/10/2026). Mismas reglas que la home v5: español
 * neutro, título con una parte en azul y casi nada de texto debajo. El
 * detalle de cada módulo lo cuentan las capturas del explorador.
 */
import type { Video } from "./home-v5";

/** Recorrido completo por la plataforma (2 a 3 min). Aquí va la demo larga. */
export const PLATAFORMA_VIDEO: Video = null;

export const PLAT5 = {
  hero: {
    h1: "La plataforma,",
    h1Accent: "módulo por módulo.",
    lede: "Capturas reales de cada módulo. Elige uno y recórrelo paso a paso.",
    secondary: "Ver los módulos",
  },
  /** Hechos del producto, no métricas de resultado. */
  datos: [
    { n: 16, t: "Módulos conectados", icon: "chart" },
    { n: 4, t: "Roles, cada uno con su vista", icon: "user" },
    { n: 0, t: "Apps para instalar", icon: "phone" },
    { n: 1, t: "Vista para todas tus sedes", icon: "shield" },
  ],
  modulos: { h2: "Elige un módulo", h2Accent: "y míralo por dentro." },
  roles: { h2: "Cada rol,", h2Accent: "su propia vista." },
  sedes: {
    h2: "La misma plantilla",
    h2Accent: "en todas tus sedes.",
    puntos: ["Se arma una vez", "Cada sede ve lo suyo", "Los números se comparan"],
  },
  integra: {
    h2: "Convive con",
    h2Accent: "lo que ya usas.",
    items: [
      { icon: "save", t: "Excel", d: "Importamos equipos, personas, sectores e históricos." },
      { icon: "chart", t: "Reportes en PDF", d: "Constancias e informes listos para auditorías." },
      { icon: "zap", t: "SAP y Active Directory", d: "Integraciones en la línea Enterprise." },
      { icon: "shield", t: "Inicio de sesión único", d: "SSO en la línea Enterprise." },
    ],
  },
  faq: { h2: "Lo que suelen", h2Accent: "preguntar." },
  banda: { h2: "¿Lo vemos", h2Accent: "con tu operación?" },
};
