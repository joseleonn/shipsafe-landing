/**
 * Un solo camino para agendar: cualquier "Agendá una demo" abre el modal con
 * las tres preguntas (DemoModal), y de ahí sale Calendly ya cargado. Esto es
 * el cable entre el botón y el modal: un evento en window, sin estado global.
 */
const EVENT = "ss:demo-modal";

export function openDemoModal(section: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { section } }));
}

export function onDemoModal(cb: (section: string) => void) {
  const handler = (e: Event) => cb(String((e as CustomEvent<{ section?: string }>).detail?.section ?? "modal"));
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
