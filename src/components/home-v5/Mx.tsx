import Image from "next/image";
import SocialIcon from "@/components/site/SocialIcon";
import DemoLink from "@/components/site/DemoLink";
import { Rise, Words } from "./Motion5";
import { MX } from "@/lib/mx";

/** Bloque "Tu contacto en México" de /mx: Hugo con foto, rol, Lemniscus y el botón para agendar. */
export function MxContacto() {
  const c = MX.contacto;
  const p = c.persona;
  return (
    <section className="h5-mx-contacto" id="contacto-mx">
      <div className="wrap">
        <h2>
          <Words text={c.h2} accent={c.h2Accent} />
        </h2>
        <Rise className="h5-mx-card">
          {p.photo && <Image src={p.photo} alt={`Foto de ${p.name}`} width={320} height={320} className="h5-mx-photo" />}
          <div className="h5-mx-copy">
            <span className="h5-tag">{c.rol}</span>
            <h3>{p.name}</h3>
            <span className="h5-mx-empresa">{c.empresa}</span>
            <p>{c.texto}</p>
            <div className="h5-mx-actions">
              <DemoLink section="mx-contacto" className="btn btn-primary">
                {c.cta}
              </DemoLink>
              {p.linkedin && (
                <a className="h5-in" href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn de ${p.name}`}>
                  <SocialIcon id="linkedin" size={16} />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}
