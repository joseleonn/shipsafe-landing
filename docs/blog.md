# Blog con Neon

Los artículos del blog viven en una tabla de Postgres en Neon (plan gratis), no en el código. Publicar
no requiere deploy.

## Flujo

1. Entra un borrador por `POST /api/blog/borradores` (tarea semanal o n8n).
   Siempre entra como `borrador`; el endpoint nunca publica.
2. José lo abre en `/interno/blog` (misma sesión que el dashboard), lo lee como
   va a quedar y aprieta **Publicar**.
3. La página `/blog/<slug>`, el índice `/blog`, el sitemap y `/llms.txt` se
   regeneran en la próxima visita. Además se regeneran solos cada hora.

## Configuración (una sola vez)

1. Base de Neon `shipsafe-blog` creada desde Vercel (Storage → Neon), conectada al proyecto `shipsafe-landing` con el prefijo `BLOG_DATABASE`: la integración carga
   `BLOG_DATABASE_DATABASE_URL` (y sus variantes) sola en Production y Preview.
2. La tabla se crea sola la primera vez que la landing se conecta (`asegurarTabla` en `src/lib/blog.ts`). `docs/blog-neon.sql` tiene el mismo esquema por si se quiere crear a mano.
3. `BLOG_INGEST_SECRET` en Vercel: el secreto del endpoint de borradores. Hace
   falta recién cuando se arme la tarea que escribe los borradores.

El código lee, en orden, `BLOG_DATABASE_URL`, `BLOG_DATABASE_DATABASE_URL`,
`BLOG_DATABASE_POSTGRES_URL` y `DATABASE_URL`.

Los primeros borradores vienen en `src/lib/blog-semillas.ts` y se cargan solos
cuando se crea la tabla, sin pisar nada que ya exista.

Sin base configurada el sitio sigue andando: `/blog` muestra solo las guías y
`/interno/blog` avisa qué falta. La base de Neon se apaga sola tras unos
minutos sin uso y se prende en la primera consulta; no hay que reactivarla.

## Formato del borrador

```json
POST /api/blog/borradores
Authorization: Bearer <BLOG_INGEST_SECRET>

{
  "slug": "constancia-entrega-epp",
  "titulo": "Constancia de entrega de EPP: qué tiene que tener",
  "descripcion": "Hasta ~160 caracteres. Es la meta description y la bajada.",
  "contenido_html": "<p>Respuesta directa en el primer párrafo.</p><h2>…</h2>",
  "faqs": [{ "pregunta": "…", "respuesta": "…" }],
  "palabra_clave": "constancia de entrega de epp",
  "fuentes": [{ "titulo": "Res. SRT 299/11", "url": "https://…" }],
  "notas_revision": "Lo que quedó marcado como [verificar]"
}
```

- `contenido_html`: HTML semántico sin clases (`h2`, `h3`, `p`, `ul`, `ol`,
  `strong`, `a`, `blockquote`). Sin `h1` (lo pone la plantilla) y sin `<script>`.
- Las FAQ se muestran al final del artículo y generan el structured data
  FAQPage. No repetirlas dentro de `contenido_html`.
- Si el slug ya existe como borrador, se reemplaza. Si ya está publicado, el
  endpoint responde 409 y no lo toca.

## Archivos

- `src/lib/blog.ts`: lectura y escritura en Neon (`@neondatabase/serverless`, por HTTP).
- `src/app/blog/`: índice y artículo público (ISR).
- `src/app/interno/blog/`: revisión y publicación.
- `src/app/api/blog/borradores/route.ts`: entrada de borradores.
- `src/app/llms.txt/route.ts`: resumen del sitio para modelos de lenguaje.
