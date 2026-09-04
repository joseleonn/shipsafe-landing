import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import Probalo from "./_components/Probalo";
import "./probalo.css";

export const metadata: Metadata = {
  title: `Probá una inspección | ${SITE.name}`,
  description:
    "Una inspección de prueba, igual a la que ve el operario cuando escanea el QR de un matafuego. Sin registrarte, sin instalar nada, sin guardar datos.",
  alternates: { canonical: "/probalo" },
  // Es una demo interactiva, no una página para posicionar.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Probalo />;
}
