# Pipeline de despliegue automático VPS (web + medusa)

**Fecha:** 2026-06-22
**Estado:** Implementado (2026-06-22)

**Nota de implementación:** el repo de medusa se migró de `modelaiprob-tech/gruporubio-medusa` (cuenta personal) a `procesos-gr/gruporubio-medusa` durante esta sesión, al detectar que nunca había existido bajo la cuenta de la empresa. La rama de deploy de medusa es `main` (no existe `feature/tienda-medusa` en ese repo). El paso de migraciones usa la ruta completa `/app/node_modules/.bin/medusa db:migrate` (el binario no está en el `PATH` del contenedor). La clave de CI se pasa codificada en base64 en una sola línea (secret `VPS_CI_KEY_B64`) en vez de como bloque multilínea, para evitar errores de copy-paste; el workflow la decodifica y la escribe dentro de `github.workspace` (no `/tmp`, que no está montado en el contenedor de `appleboy/ssh-action`) con permisos `644`.

## Contexto

`gruporubio-web` y `gruporubio-medusa` corren en un VPS Hetzner (`116.202.27.5`) vía Docker Compose, pero las carpetas `/opt/gruporubio/web` y `/opt/gruporubio/medusa` son copias de archivos sueltas, no clones git. Desplegar una actualización hoy requiere rsync manual + rebuild manual por SSH, y no hay forma de saber qué commit está corriendo en producción en cada momento. El VPS lleva desde 2026-06-16 sin actualizarse (43 commits de diferencia con `origin`).

## Objetivo

Que un `git push` a la rama `feature/tienda-medusa` en cualquiera de los dos repos despliegue automáticamente esa versión en el VPS, sin intervención manual, con una red de seguridad que evite dejar el servicio caído si el deploy falla.

## Fuera de alcance

- Zero-downtime real (blue-green / health-check antes de swap) — descartado, el tráfico actual no lo justifica
- Versionar `docker-compose.yml` en un repo — se queda solo en el VPS por ahora
- Cualquier cambio a la rama de despliegue (sigue siendo `feature/tienda-medusa`, no `main`)
- Migrar de Vercel (deploy provisional) — esto es solo para el VPS

## Arquitectura

```
push a feature/tienda-medusa (web o medusa)
        │
        ▼
GitHub Actions (.github/workflows/deploy.yml en cada repo)
        │  ssh con clave de CI (forced command)
        ▼
VPS: /opt/gruporubio/deploy-web.sh  ó  deploy-medusa.sh
        │
        ├─ git fetch + git reset --hard origin/feature/tienda-medusa
        ├─ docker compose build <servicio>
        ├─ (solo medusa) docker compose run --rm medusa medusa db:migrate
        └─ docker compose up -d <servicio>
```

### Dos tipos de clave SSH (no confundir)

1. **GitHub Deploy Key** (una por repo, read-only) — vive en el VPS (`~/.ssh/id_ed25519_deploy_<repo>`), su mitad pública se añade en GitHub → Settings del repo → Deploy keys. Permite `git clone`/`git pull` del repo privado desde el VPS sin usar credenciales personales.
2. **Clave SSH de CI** (una por repo, distinta de la clave personal de root) — la mitad privada vive como secret de GitHub Actions (`VPS_DEPLOY_KEY`); la pública se añade en `/root/.ssh/authorized_keys` del VPS con `command="/opt/gruporubio/deploy-<repo>.sh"` forzado. Aunque esa clave se filtre, solo puede ejecutar ese script — no es una shell libre.

## Migración inicial de las carpetas del VPS (manual, una vez)

Para cada repo (`web`, `medusa`):
1. Backup: `tar czf /opt/gruporubio/<repo>.backup-$(date +%Y%m%d).tar.gz /opt/gruporubio/<repo>`
2. Generar el par de claves de Deploy Key (`ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_deploy_<repo> -N ""`), añadir la pública como Deploy Key (solo lectura) en GitHub
3. Clonar en una carpeta temporal con esa Deploy Key, copiar `.env.production` desde el backup al clon nuevo
4. Sustituir la carpeta vieja por el clon (mismo path `/opt/gruporubio/<repo>`)
5. Verificar que `docker compose build <servicio>` funciona igual que antes desde el clon

## Scripts de deploy (en el VPS)

`/opt/gruporubio/deploy-web.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
cd /opt/gruporubio/web
git fetch origin
git reset --hard origin/feature/tienda-medusa
cd /opt/gruporubio
docker compose build web
docker compose up -d web
```

`/opt/gruporubio/deploy-medusa.sh`: igual, con un paso extra de migraciones entre el build y el `up -d`:
```bash
docker compose build medusa
docker compose run --rm medusa medusa db:migrate
docker compose up -d medusa
```

`set -euo pipefail` es la red de seguridad clave: si `git fetch`, el build o las migraciones fallan, el script se detiene antes de tocar el contenedor en marcha — el servicio viejo sigue corriendo, no hay downtime causado por un deploy roto.

## Workflow de GitHub Actions

Un `.github/workflows/deploy.yml` por repo, disparado en `push` a `feature/tienda-medusa`, usando `appleboy/ssh-action` con `host`, `username: root`, `key: ${{ secrets.VPS_DEPLOY_KEY }}`. El comando enviado por la action es irrelevante porque el `authorized_keys` del VPS fuerza el script correcto independientemente de lo que se pida.

## Manejo de errores / rollback

- Build o migración fallida → el script aborta antes del `up -d`, el contenedor anterior sigue activo. El job de GitHub Actions queda en rojo, visible en la pestaña Actions del repo.
- Rollback manual si hace falta: `git reset --hard <commit-anterior>` dentro de la carpeta del repo en el VPS + re-ejecutar el script de deploy correspondiente.

## Plan de pruebas

1. Migrar `web` primero (menor riesgo, sin estado/DB), confirmar deploy automático con un commit trivial (ej. cambio de comentario)
2. Migrar `medusa`, confirmar que las migraciones corren sin error y el contenedor levanta
3. Provocar un fallo intencional (ej. error de sintaxis) para confirmar que el script aborta y el contenedor viejo sigue sirviendo tráfico
4. Limpiar los backups de prueba una vez confirmado que todo funciona
