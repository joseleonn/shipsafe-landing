import HomeV5 from "@/components/home-v5/HomeV5";

// Home v5 (24/10/2026). La v4 sigue en components/home/Home.tsx: para volver,
// alcanza con importar Home en lugar de HomeV5 (y reponer el FAQPage, que
// ahora vive en /plataforma junto con las preguntas frecuentes).
export default function Page() {
  return <HomeV5 />;
}
