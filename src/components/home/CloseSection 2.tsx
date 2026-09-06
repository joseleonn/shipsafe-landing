import DemoLink from "@/components/site/DemoLink";
import Icon from "@/components/site/Icon";
import LeadForm from "./LeadForm";
import { whatsappUrl } from "@/lib/home-content";

export default function CloseSection({ num = "10", source = "home" }: { num?: string | null; source?: string }) {
  return (
    <section className="close" id="demo">
      <span id="contacto" />
      <div className="wrap">
        <div className="close-copy">
          <div className="eyebrow num">{num && <span>{num}</span>}Empecemos</div>
          <h2>
            Agendá una demo <em>sobre tu operación.</em>
          </h2>
          <p className="lede">Treinta minutos, con tus frentes, tu flota y tus vencimientos. No sobre nuestro producto.</p>
          <ol className="what">
            <li><b>Nos contás cómo registran hoy</b> y dónde se pierde: el frente, la flota, el pañol, la otra sucursal.</li>
            <li><b>Vemos el flujo completo con un caso tuyo:</b> QR, registro con foto y firma, el desvío que nace, su cierre y lo que ve la gerencia.</li>
            <li><b>Te llevás una propuesta concreta</b> y lo que haría falta para arrancar. Si no es para vos, también te lo decimos.</li>
          </ol>
        </div>
        <div className="panel" id="panel">
          <DemoLink section="cierre" className="btn btn-primary btn-lg">
            <Icon name="calendar" />
            Elegí día y horario
          </DemoLink>
          <div className="or">o dejanos tus datos y te escribimos en menos de 24 h</div>
          <LeadForm source={source} />
          <div className="wa">
            ¿Preferís WhatsApp?{" "}
            <a href={whatsappUrl("Hola, quiero agendar una demo de SHIPSAFE")} target="_blank" rel="noopener noreferrer">
              <Icon name="msg" />
              Escribinos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
