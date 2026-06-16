import Image from "next/image";
import Link from "next/link";
import { CTAS } from "@/lib/constants";

/**
 * Footer minimalista: logo + links legales + WhatsApp. Nada más.
 * Sin el árbol de links del footer del sitio, para no fugar conversión.
 */
export default function CampaignFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div className="flex items-center gap-2.5">
          <Image
            src="/shipsafe-logo.png"
            alt="SHIPSAFE"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="font-display text-base font-bold tracking-tight text-white">
            SHIPSAFE
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/65">
          <Link href="/terminos" className="transition-colors hover:text-white">
            Términos
          </Link>
          <Link
            href="/politica-privacidad"
            className="transition-colors hover:text-white"
          >
            Privacidad
          </Link>
          <a
            href={CTAS.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </footer>
  );
}
