#!/usr/bin/env bash
#
# Sube los cambios del proyecto en un solo paso.
#
#   npm run subir "fix: lo que hayas cambiado"
#
# Por qué existe: Claude edita los archivos directamente en el disco, pero no
# puede correr git. El entorno donde trabaja no tiene permiso de borrado, y git
# necesita borrar todo el tiempo — locks de índice, locks de referencias,
# objetos temporales. Un git corrido desde ahí deja archivos colgados y el
# commit siguiente falla con "cannot lock ref 'HEAD'". Así que el commit lo
# hacés vos, pero en un comando en lugar de tres.

set -euo pipefail

# Sin esto, `git diff --stat` abre `less` y el script queda esperando una tecla
# que nadie sabe que hay que apretar. En un script no interactivo el paginador
# no aporta nada.
export GIT_PAGER=cat
export PAGER=cat

cd "$(dirname "$0")/.."

# "$*" y no "$1": npm re-parte el string del mensaje en argumentos sueltos, así
# que `npm run subir "feat: algo largo"` llega acá como varios parámetros. Con
# $1 el commit se llamaría "feat:" a secas.
MENSAJE="$*"
if [ -z "$MENSAJE" ]; then
  echo "Falta el mensaje del commit."
  echo "Uso: npm run subir \"feat: lo que cambiaste\""
  exit 1
fi

# Solo código y documentación. Sin esto se cuelan .claude/ y cualquier carpeta
# temporal que haya quedado dando vueltas.
RUTAS=(src docs scripts public package.json package-lock.json next.config.ts
       tsconfig.json AGENTS.md CLAUDE.md README.md)

echo "── Cambios que se van a subir ────────────────────────────"
git add -A -- "${RUTAS[@]}"

if git diff --cached --quiet; then
  echo "No hay nada nuevo. Nada que subir."
  exit 0
fi

git --no-pager diff --cached --stat
echo

read -r -p "¿Confirmás? [s/N] " RESPUESTA
case "$RESPUESTA" in
  s|S|si|SI|Si|y|Y) ;;
  *) echo "Cancelado. Los cambios quedan preparados; con 'git reset' los deshacés."; exit 1 ;;
esac

git commit -m "$MENSAJE"

RAMA="$(git rev-parse --abbrev-ref HEAD)"
echo
echo "── Subiendo a origin/$RAMA ───────────────────────────────"
git push origin "$RAMA"

echo
echo "Listo. Mirá el deploy en Vercel; cuando diga Ready, probá el cambio."
