<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# No corras git desde una sesión con la carpeta montada

Si estás editando estos archivos a través de una carpeta montada (Cowork, o
cualquier entorno sin permiso de borrado), **no corras git**. Ese entorno no
puede hacer `unlink`, y git borra todo el tiempo: locks de índice, locks de
referencias, objetos temporales en `.git/objects/**/tmp_obj_*`.

Lo que pasa en la práctica: el primer commit parece funcionar, pero deja un
`.git/HEAD.lock` colgado, y el siguiente muere con
`fatal: cannot lock ref 'HEAD': File exists`. No hay una limpieza confiable,
porque los nombres de los temporales son aleatorios y aparecen en rutas
distintas según la operación.

Editá los archivos y dejá que la persona suba los cambios con:

    npm run subir "feat: lo que cambiaste"

Ese script agrega solo código y documentación, muestra el diff, pide
confirmación, commitea y pushea. Está en `scripts/subir.sh`.
