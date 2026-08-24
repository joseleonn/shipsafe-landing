import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRecurso } from "../../_data";
import GraciasClient from "./GraciasClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Listo | SHIPSAFE",
  robots: { index: false, follow: false },
};

export default async function GraciasPage({ params }: Props) {
  const { slug } = await params;
  const recurso = getRecurso(slug);
  if (!recurso) notFound();

  return (
    <GraciasClient
      titulo={recurso.titulo}
      archivo={recurso.archivo}
      archivoListo={recurso.archivoListo}
    />
  );
}
