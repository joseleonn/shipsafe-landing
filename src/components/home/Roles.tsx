"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReduce } from "@/components/site/useReduce";
import Link from "next/link";
import Icon, { type IconName } from "@/components/site/Icon";
import { ShotFrame } from "@/components/site/Frames";
import { ROLES } from "@/lib/home-content";
import { trackEvent, EVENTS } from "@/lib/analytics";

const EASE = [0.2, 0.8, 0.2, 1] as const;

export default function Roles() {
  const [active, setActive] = useState(0);
  const reduce = useReduce();
  const role = ROLES[active];

  const select = (i: number) => {
    setActive(i);
    trackEvent(EVENTS.ROLE_TAB, { role: ROLES[i].id });
  };

  return (
    <section className="roles" id="roles">
      <div className="glow tl" aria-hidden="true" />
      <span id="beneficios" />
      <div className="wrap">
        <div className="sec-head">
          <div className="eyebrow num"><span>01</span>Roles</div>
          <h2>
            Cada rol entra por su puerta. <em>Todos ven la misma información.</em>
          </h2>
          <p className="lede">No es una app de inspecciones para un técnico. Es el lugar donde trabaja toda la operación de seguridad e higiene, y lo que uno carga, el otro lo ve en el momento.</p>
        </div>
        <div className="roles-ui">
          <div className="tabs" role="tablist" aria-label="Roles">
            {ROLES.map((r, i) => (
              <button
                key={r.id}
                className={`tab ${i === active ? "is-active" : ""}`}
                role="tab"
                aria-selected={i === active}
                aria-controls={`role-${r.id}`}
                id={`tab-${r.id}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(e) => {
                  const n = e.key === "ArrowRight" ? (i + 1) % ROLES.length : e.key === "ArrowLeft" ? (i - 1 + ROLES.length) % ROLES.length : -1;
                  if (n >= 0) { e.preventDefault(); select(n); (document.getElementById(`tab-${ROLES[n].id}`) as HTMLElement | null)?.focus(); }
                }}
              >
                {i === active && !reduce && <motion.span layoutId="role-indicator" className="tab-bg" transition={{ duration: 0.26, ease: EASE }} />}
                <Icon name={r.icon as IconName} />
                <span><b>{r.label}</b></span>
              </button>
            ))}
          </div>
          <div className="panels">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={role.id}
                className="panel is-active"
                id={`role-${role.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${role.id}`}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <div className="visual">
                  <ShotFrame shot={role.shot} sizes="(max-width: 900px) 100vw, 640px" />
                </div>
                <div className="detail">
                  <h3>{role.title}</h3>
                  <p>{role.text}</p>
                  <ul>
                    {role.bullets.map((b) => (
                      <li key={b}>
                        <Icon name="check" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <p className="roles-more">
          También el <b>consultor externo</b>: gestiona varios clientes desde una sola cuenta, con datos separados y reportes mensuales para cada uno.{" "}
          <Link className="link" href="/consultores">
            Programa de consultores <Icon name="arrow" />
          </Link>
        </p>
      </div>
    </section>
  );
}
