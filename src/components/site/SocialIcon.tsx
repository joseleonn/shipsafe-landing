/** Íconos de redes, en trazo simple para que sigan el color del texto. */
export default function SocialIcon({ id, size = 18 }: { id: "linkedin" | "instagram" | "tiktok" | "youtube"; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  if (id === "linkedin")
    return (
      <svg {...common} fill="currentColor">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3v-11zm6.5 0h3.8v1.5h.06c.53-1 1.83-1.8 3.4-1.8 3.63 0 4.24 2.2 4.24 5.07v6.23h-4v-5.5c0-1.31-.03-3-1.83-3-1.84 0-2.12 1.43-2.12 2.9v5.6h-4v-11z" />
      </svg>
    );
  if (id === "instagram")
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    );
  if (id === "tiktok")
    return (
      <svg {...common} fill="currentColor">
        <path d="M16.6 3c.3 2.2 1.7 3.8 4 4v3.1a7.3 7.3 0 0 1-4-1.2v6.1A6 6 0 1 1 10.6 9v3.2a2.9 2.9 0 1 0 2.9 2.9V3h3.1z" />
      </svg>
    );
  return (
    <svg {...common} fill="currentColor">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" />
    </svg>
  );
}
