-- Blog de la landing (www.shipsafe.lat/blog), en Neon.
--
-- Correr una sola vez en la base de Neon del blog (SQL Editor de Neon o psql).
-- Es una base aparte de la de la app: la landing nunca tiene acceso a datos
-- de clientes.
--
-- Flujo: los borradores entran con estado 'borrador' (desde la tarea semanal o
-- n8n, por POST /api/blog/borradores). José los revisa en /interno/blog y los
-- publica con un botón. Solo los 'publicado' se ven en el sitio.

create table if not exists public.articulos (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  titulo            text not null,
  descripcion       text not null,               -- meta description y bajada (máx. ~160 caracteres)
  contenido_html    text not null,               -- HTML semántico sin clases: h2, h3, p, ul, ol, strong, a, blockquote
  faqs              jsonb not null default '[]', -- [{ "pregunta": "...", "respuesta": "..." }]
  palabra_clave     text,                        -- búsqueda principal que ataca el artículo
  fuentes           jsonb not null default '[]', -- [{ "titulo": "...", "url": "..." }] para revisar la normativa
  notas_revision    text,                        -- qué quedó marcado como [verificar]
  estado            text not null default 'borrador'
                    check (estado in ('borrador', 'publicado', 'descartado')),
  fecha_publicacion timestamptz,
  creado            timestamptz not null default now(),
  actualizado       timestamptz not null default now()
);

create index if not exists articulos_estado_fecha
  on public.articulos (estado, fecha_publicacion desc);

create or replace function public.articulos_tocar_actualizado()
returns trigger language plpgsql as $$
begin
  new.actualizado := now();
  return new;
end $$;

drop trigger if exists articulos_actualizado on public.articulos;
create trigger articulos_actualizado
  before update on public.articulos
  for each row execute function public.articulos_tocar_actualizado();
