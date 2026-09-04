"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/site/Icon";
import DemoLink from "@/components/site/DemoLink";
import { trackEvent, EVENTS } from "@/lib/analytics";

/**
 * /probalo — réplica fiel de la pantalla de ejecución de checklist de la app
 * (misma jerarquía, mismos tokens, mismos textos), corriendo entera en el
 * navegador del visitante. No toca la app real ni guarda nada: la foto queda
 * en memoria, el "desvío" que se crea es una simulación, y al cerrar la
 * pestaña desaparece todo. Es la "inspección de prueba" a la que apunta el QR
 * de la home.
 */

type Answer = "ok" | "no_ok" | "na";

const CHECKLIST = {
  title: "Inspección anual de extintores portátiles",
  norma: "Norma IRAM 3517 · Decreto 351/79 Cap. 18",
  equipo: "EXT-001 · Extintor ABC 5 kg · Entrada principal",
  seccion: "Protección contra incendios",
  preguntas: [
    "¿El cuerpo del extintor está libre de corrosión, picaduras, golpes o deformaciones?",
    "¿La ubicación del extintor cumple con la distancia máxima de recorrido (15 m para fuegos clase A)?",
    "¿El manómetro indica presión dentro del rango verde?",
    "¿El precinto y el pasador de seguridad están intactos?",
    "¿La tarjeta de control tiene la última fecha de mantenimiento registrada?",
    "¿La manguera y la tobera están sin obstrucciones ni grietas?",
  ],
};

interface Q {
  answer?: Answer;
  obs?: string;
  obsOpen?: boolean;
  photo?: string;
}

export default function Probalo() {
  const [qs, setQs] = useState<Q[]>(() => CHECKLIST.preguntas.map(() => ({})));
  const [doneAt, setDoneAt] = useState<number | null>(null);
  const done = doneAt !== null;
  const [saved, setSaved] = useState(true);
  const started = useRef(false);
  const answered = qs.filter((q) => q.answer).length;
  const total = CHECKLIST.preguntas.length;
  const noOk = useMemo(() => qs.map((q, i) => ({ q, i })).filter(({ q }) => q.answer === "no_ok"), [qs]);
  const remaining = total - answered;

  useEffect(() => {
    // "Guardado ✓": autoguardado simulado, como en la app. Cada cambio pone
    // saved=false (en el handler) y 600 ms después vuelve a "Guardado".
    if (saved) return;
    const t = setTimeout(() => setSaved(true), 600);
    return () => clearTimeout(t);
  }, [saved]);

  const update = (i: number, patch: Partial<Q>) => {
    if (!started.current) {
      started.current = true;
      trackEvent(EVENTS.PROBALO_START, {});
    }
    setSaved(false);
    setQs((prev) => prev.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  };

  const onPhoto = (i: number, file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    update(i, { photo: url });
  };

  const complete = () => {
    if (remaining > 0) return;
    trackEvent(EVENTS.PROBALO_COMPLETE, { no_ok: noOk.length });
    setDoneAt(Date.now());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) return <Result noOk={noOk} total={total} doneAt={doneAt} onRestart={() => { setQs(CHECKLIST.preguntas.map(() => ({}))); setDoneAt(null); }} />;

  return (
    <div className="pb">
      <div className="pb-demo-note">
        <Icon name="scan" /> Inspección de prueba · nada de esto se guarda
      </div>
      <div className="pb-app">
        <header className="pb-head">
          <Link href="/" className="pb-back" aria-label="Volver">
            <Icon name="back" />
          </Link>
          <div className="pb-head-t">
            <b>{CHECKLIST.title}</b>
            <span>
              {answered}/{total} respondidas · <em className={saved ? "ok" : ""}>{saved ? "Guardado ✓" : "Guardando…"}</em>
            </span>
          </div>
          <div className="pb-progress" aria-hidden="true">
            <span style={{ width: `${(answered / total) * 100}%` }} />
          </div>
        </header>

        <div className="pb-equipo">
          <span className="pb-tag"><Icon name="qr" /> QR escaneado</span>
          <b>{CHECKLIST.equipo}</b>
          <small>{CHECKLIST.norma}</small>
        </div>

        <ol className="pb-list">
          {CHECKLIST.preguntas.map((text, i) => {
            const q = qs[i];
            return (
              <li className="pb-q" key={i}>
                <div className="pb-q-head">
                  <span className="pb-n">{i + 1}</span>
                  <span className="pb-chip">{CHECKLIST.seccion}</span>
                </div>
                <p className="pb-q-text">{text}</p>
                <div className="pb-answers" role="radiogroup" aria-label={`Pregunta ${i + 1}`}>
                  {(
                    [
                      ["ok", "OK", "check"],
                      ["no_ok", "NO OK", "x"],
                      ["na", "N/A", "minus"],
                    ] as const
                  ).map(([val, label, icon]) => (
                    <button
                      key={val}
                      type="button"
                      role="radio"
                      aria-checked={q.answer === val}
                      className={`pb-ans ${val} ${q.answer === val ? "on" : ""}`}
                      onClick={() => update(i, { answer: val, obsOpen: q.obsOpen || val === "no_ok" })}
                    >
                      <span className="pb-ans-ic"><Icon name={icon} /></span>
                      {label}
                    </button>
                  ))}
                </div>
                <button type="button" className="pb-obs-toggle" onClick={() => update(i, { obsOpen: !q.obsOpen })} aria-expanded={!!q.obsOpen}>
                  <Icon name="chevron" /> {q.obsOpen ? "Ocultar observación" : "Agregar observación"}
                </button>
                {q.obsOpen && (
                  <textarea
                    className="pb-obs"
                    placeholder={q.answer === "no_ok" ? "Qué encontraste (ej.: manómetro en rojo, precinto roto)" : "Observación opcional"}
                    value={q.obs ?? ""}
                    onChange={(e) => update(i, { obs: e.target.value })}
                    rows={2}
                  />
                )}
                <div className="pb-photo-row">
                  <label className="pb-photo-btn">
                    <Icon name="camera" /> {q.photo ? "Cambiar foto" : "Adjuntar foto"}
                    <input type="file" accept="image/*" capture="environment" onChange={(e) => onPhoto(i, e.target.files?.[0] ?? null)} />
                  </label>
                  {q.photo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="pb-thumb" src={q.photo} alt="Foto adjunta" />
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="pb-spacer" />
        <div className="pb-bottom">
          <button type="button" className="pb-complete" disabled={remaining > 0} onClick={complete}>
            <Icon name="check" /> Completar checklist
          </button>
          <p className="pb-remaining">{remaining > 0 ? `Faltan ${remaining} pregunta${remaining === 1 ? "" : "s"} por responder` : "Listo para completar"}</p>
          <button type="button" className="pb-draft"><Icon name="save" /> Guardar borrador</button>
          <nav className="pb-nav" aria-label="Navegación de la app (demo)">
            <span><Icon name="menu" />Menú</span>
            <span className="pb-scan"><i><Icon name="qr" /></i>Escanear</span>
            <span><Icon name="user" />Perfil</span>
          </nav>
        </div>
      </div>
      <aside className="pb-side">
        <div className="eyebrow">Lo que estás viendo</div>
        <h2>La pantalla del operario, tal cual.</h2>
        <p>Es la misma jerarquía y los mismos textos que en SHIPSAFE. Respondé las seis preguntas; si marcás algún <b>NO OK</b>, al completar vas a ver el desvío que nace solo, con dueño y fecha.</p>
        <p className="pb-side-note">Nada se guarda ni se envía. Para verlo con tu operación, agendá una demo.</p>
        <DemoLink section="probalo" className="btn btn-primary" />
      </aside>
    </div>
  );
}

function Result({ noOk, total, doneAt, onRestart }: { noOk: { q: Q; i: number }[]; total: number; doneAt: number; onRestart: () => void }) {
  const due = new Date(doneAt + 72 * 3600 * 1000);
  const fmt = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  return (
    <div className="pb">
      <div className="pb-demo-note">
        <Icon name="scan" /> Inspección de prueba · nada de esto se guarda
      </div>
      <div className="pb-app pb-result">
        <div className="pb-done">
          <div className="pb-done-ic"><Icon name="check" /></div>
          <b>Checklist completado</b>
          <span>{total} de {total} respondidas · con foto y firma</span>
        </div>

        {noOk.length > 0 ? (
          <>
            <div className="pb-sec">Se {noOk.length === 1 ? "creó 1 desvío" : `crearon ${noOk.length} desvíos`}, sin que nadie cargue nada más</div>
            {noOk.map(({ q, i }, k) => (
              <div className="pb-desvio" key={i}>
                <div className="pb-desvio-h">
                  <span className="pb-id">#{503 + k}</span>
                  <span className="pb-badge alta">Alta</span>
                  <span className="pb-badge abierto">Abierto</span>
                </div>
                <b>{CHECKLIST.preguntas[i]}</b>
                {q.obs && <p className="pb-desvio-obs">“{q.obs}”</p>}
                <dl className="pb-desvio-meta">
                  <div><dt>Equipo</dt><dd>{CHECKLIST.equipo}</dd></div>
                  <div><dt>Responsable</dt><dd>Mantenimiento · Sede Central</dd></div>
                  <div><dt>Fecha límite</dt><dd>{fmt.format(due)} (72 h)</dd></div>
                  <div><dt>Origen</dt><dd>Checklist · {CHECKLIST.title}</dd></div>
                </dl>
                <div className="pb-timeline">
                  <span><i /> Desvío generado desde checklist · recién</span>
                  <span className="next"><i /> Mantenimiento lo recibe en su celular</span>
                  <span className="next"><i /> Supervisor verifica el cierre con la foto</span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="pb-sec">Todo OK: no se generaron desvíos. El registro quedó con fecha, foto y firma.</div>
        )}

        <div className="pb-cta">
          <p>Esto es lo que ve mantenimiento, el supervisor y la gerencia, en el momento. Con tus equipos, tus checklists y tu gente.</p>
          <DemoLink section="probalo-final" className="btn btn-primary btn-lg" />
          <button type="button" className="pb-again" onClick={onRestart}>Hacer otra inspección de prueba</button>
          <Link href="/" className="pb-home">Volver a la página</Link>
        </div>
      </div>
    </div>
  );
}
