"use client";

import { useEffect, useState } from "react";
import DemoLink from "@/components/site/DemoLink";
import { openDemoModal } from "@/lib/demo-modal";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { loadCalendly } from "@/lib/calendly-embed";

/**
 * El hero de /puesta-en-marcha, del lado del cliente porque se adapta al
 * proceso con el que viene la persona (?p=matriz, ?p=matafuegos…).
 *
 * POR QUÉ (22/09/2026): a esta página la usan dos tráficos distintos.
 *
 *   · Los anuncios, que hablan de un dolor genérico (el dato llega tarde).
 *   · El DM de Instagram, que viene de una conversación entera sobre la
 *     MATRIZ DE RIESGOS.
 *
 * El hero anterior ("Elegí el proceso que más te duele") no nombraba la
 * matriz en ningún lado, así que el que llegaba desde el DM aterrizaba en una
 * página que no continuaba su conversación y encima le pedía elegir algo que
 * nunca le habían explicado. Con ?p=<slug> el título y la bajada hablan de SU
 * proceso, y el chip correspondiente queda marcado como elegido.
 */

type Proceso = { slug: string; label: string; h1: string; lede: string };

export const PROCESOS: Proceso[] = [
  {
    slug: "matriz",
    label: "Matriz de riesgos",
    h1: "Tu matriz de riesgos, andando en media hora.",
    lede:
      "La cargamos con los riesgos reales de tu operación y queda conectada con las inspecciones y el seguimiento de desvíos. No es un Excel que se desactualiza solo.",
  },
  {
    slug: "preuso",
    label: "Preuso de vehículos",
    h1: "Tu preuso de vehículos, andando en media hora.",
    lede:
      "El chofer completa el checklist desde el celular y vos ves el desvío en el momento, no cuando el vehículo vuelve a base.",
  },
  {
    slug: "matafuegos",
    label: "Matafuegos",
    h1: "Tus matafuegos, controlados en media hora.",
    lede:
      "Cada equipo con su QR, su vencimiento y su última revisión. Sabés qué falta antes de que te lo pregunten.",
  },
  {
    slug: "desvios",
    label: "Desvíos",
    h1: "Tus desvíos, seguidos en media hora.",
    lede:
      "Cada desvío con responsable, plazo y evidencia de cierre. Dejás de perseguirlos por WhatsApp.",
  },
  {
    slug: "epp",
    label: "Entregas de EPP",
    h1: "Tus entregas de EPP, ordenadas en media hora.",
    lede:
      "Quién recibió qué, cuándo y con qué firma. Queda el respaldo sin que tengas que archivar papeles.",
  },
  {
    slug: "capacitaciones",
    label: "Capacitaciones",
    h1: "Tus capacitaciones, al día en media hora.",
    lede:
      "Quién se capacitó, en qué y cuándo le vence. Con el registro listo para mostrar.",
  },
];

const DEFAULT_H1 = "Tu proceso de seguridad, andando en media hora.";
const DEFAULT_LEDE =
  "Matriz de riesgos, preuso de vehículos, matafuegos, desvíos, EPP o capacitaciones: elegís con cuál arrancamos y lo dejamos funcionando con tus datos.";

export default function HeroPuesta() {
  const [elegido, setElegido] = useState<Proceso | null>(null);

  // El parámetro llega del link que manda el DM. Se lee después del montaje
  // para que la página siga siendo estática (se sirve igual a todo el mundo).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("p");
    const match = PROCESOS.find((x) => x.slug === p);
    if (match) {
      setElegido(match);
      trackEvent("proceso_en_link", { proceso: match.label });
    }
  }, []);

  const warm = () => {
    loadCalendly().catch(() => {});
  };

  const abrir = (p: Proceso) => {
    trackEvent(EVENTS.DEMO_CLICK, { section: "puesta-chip", source: "home", step: "open", proceso: p.label });
    trackEvent("proceso_elegido", { proceso: p.label });
    openDemoModal("puesta-chip", p.label);
  };

  return (
    <>
      <h1>{elegido ? elegido.h1 : DEFAULT_H1}</h1>
      <p className="lede">{elegido ? elegido.lede : DEFAULT_LEDE}</p>
      <ul className="chips-row chips-pick" aria-label="Procesos con los que podés empezar">
        {PROCESOS.map((p) => (
          <li key={p.slug} className={elegido?.slug === p.slug ? "is-on" : undefined}>
            <button type="button" onClick={() => abrir(p)} onMouseEnter={warm} onTouchStart={warm}>
              {p.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="hero-cta">
        <DemoLink section="puesta-hero" className="btn btn-primary btn-lg">
          {elegido ? `Arrancar con ${elegido.label.toLowerCase()}` : "Elegir el mío"}
        </DemoLink>
      </div>
      <p className="fine">30 minutos · llego con la mitad hecha · después lo usás 30 días sin costo</p>
    </>
  );
}
