import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/site/Icon";
import { PhoneFrame } from "@/components/site/Frames";
import { SHOTS } from "@/lib/home-content";

/**
 * "Probalo por tu cuenta": el QR abre /probalo, una réplica de la pantalla de
 * ejecución de checklist de la app, en la landing misma. No toca la app ni
 * crea datos: todo vive en el navegador del visitante.
 */
export default function TryIt() {
  return (
    <section className="tryit" id="probalo">
      <div className="wrap">
        <div className="try-card">
          <div className="glow tr" aria-hidden="true" />
          <div className="try-copy">
            <div className="eyebrow num"><span>04</span>Probalo por tu cuenta</div>
            <h2>
              Escaneá el QR y hacé una inspección <em>en dos minutos.</em>
            </h2>
            <p className="lede">Es la misma pantalla que ve tu operario cuando escanea el código pegado en un matafuego. Sin registrarte, sin instalar nada.</p>
            <ol className="try-steps">
              <li><span className="n">1</span><span>Apuntá la cámara del celular al código.</span></li>
              <li><span className="n">2</span><span>Respondé el checklist de prueba: OK, NO OK, foto.</span></li>
              <li><span className="n">3</span><span>Mirá cómo el NO OK se convierte en un desvío con dueño y fecha.</span></li>
            </ol>
            <Link className="btn btn-secondary try-mobile" href="/probalo?utm_source=landing&utm_medium=boton&utm_campaign=probalo">
              <Icon name="phone" />
              Abrir la inspección de prueba
            </Link>
          </div>
          <div className="try-visual">
            <Link className="qr" href="/probalo?utm_source=landing&utm_medium=qr&utm_campaign=probalo" aria-label="Abrir la inspección de prueba">
              <Image src="/qr-probalo.png" alt="Código QR para abrir la inspección de prueba" width={220} height={220} unoptimized />
              <span className="qr-cap"><Icon name="scan" />Escaneá con la cámara</span>
            </Link>
            <PhoneFrame shot={SHOTS.pChecklist} sizes="220px" />
          </div>
        </div>
      </div>
    </section>
  );
}
