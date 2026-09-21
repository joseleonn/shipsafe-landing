/**
 * Un solo camino para agendar: cualquier "Agendá una demo" abre el modal con
 * las tres preguntas (DemoModal), y de ahí sale Calendly ya cargado. Esto es
 * el cable entre el botón y el modal: un evento en window, sin estado global.
 */
const EVENT = "ss:demo-modal";

type Detail = { section?: string; proceso?: string };

/**
 * `proceso` es opcional: lo manda el chip del hero de /puesta-en-marcha
 * ("Matafuegos", "Desvíos"…) para que el modal abra con esa elección ya hecha.
 */
export function openDemoModal(section: string, proceso?: string) {
  window.dispatchEvent(new CustomEvent<Detail>(EVENT, { detail: { section, proceso } }));
}

export function onDemoModal(cb: (section: string, proceso?: string) => void) {
  const handler = (e: Event) => {
    const d = (e as CustomEvent<Detail>).detail ?? {};
    cb(String(d.section ?? "modal"), d.proceso || undefined);
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
