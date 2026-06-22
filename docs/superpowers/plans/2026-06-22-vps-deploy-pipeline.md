# Pipeline de Despliegue Automático al VPS (web + medusa) — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que un `git push` a la rama correspondiente de `gruporubio-web` o `gruporubio-medusa` despliegue automáticamente esa versión en el VPS de producción, sin pasos manuales por SSH.

**Architecture:** GitHub Actions (gatillado por push) se conecta por SSH al VPS usando una clave dedicada con `command=` forzado en `authorized_keys`, que solo puede ejecutar un script de deploy concreto. Ese script hace `git pull` sobre un clon real del repo (con su propia Deploy Key de solo lectura), reconstruye el contenedor Docker correspondiente y lo levanta — sin tocar el contenedor anterior si algo falla a mitad de camino.

**Tech Stack:** Docker Compose (ya en el VPS), GitHub Actions, `appleboy/ssh-action`, bash, OpenSSH.

## Global Constraints

- VPS: Hetzner `116.202.27.5`, acceso por `ssh root@116.202.27.5` (ya verificado, funciona sin contraseña)
- Repo web: `https://github.com/procesos-gr/gruporubio-web.git`, rama de deploy `feature/tienda-medusa`
- Repo medusa: `https://github.com/modelaiprob-tech/gruporubio-medusa.git`, rama de deploy `main`
- Carpetas actuales en el VPS: `/opt/gruporubio/web`, `/opt/gruporubio/medusa`, `docker-compose.yml` en `/opt/gruporubio/docker-compose.yml` (servicios: `web`, `medusa`, `postgres`, `redis`)
- El `GITHUB_TOKEN` disponible en el entorno local **tiene permisos de admin sobre `modelaiprob-tech/gruporubio-medusa` pero solo lectura sobre `procesos-gr/gruporubio-web`** — verificado con `curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/<owner>/<repo>`. Por eso todo lo que toque Settings del repo web (Deploy Key, Secrets) se hace a mano vía la interfaz de GitHub; lo de medusa se puede automatizar por API donde el plan lo indique.
- Ninguna clave privada debe quedar persistida en el repo git ni en ningún archivo trackeado. Las claves privadas de CI se borran del disco local en cuanto están pegadas en GitHub Secrets.
- Cada script de deploy debe usar `set -euo pipefail` para abortar antes de tocar el contenedor en marcha si cualquier paso falla.

---

### Task 1: Backup de las carpetas actuales del VPS

**Files:** ninguno en el repo — solo operaciones en el VPS vía SSH.

**Interfaces:**
- Produces: `/opt/gruporubio/web.backup-<fecha>.tar.gz` y `/opt/gruporubio/medusa.backup-<fecha>.tar.gz` en el VPS — Task 2 y Task 3 los usan como red de seguridad antes de sustituir las carpetas.

- [ ] **Step 1: Confirmar que los contenedores están sanos antes de tocar nada**

Run: `ssh root@116.202.27.5 "docker ps --format '{{.Names}}: {{.Status}}'"`
Expected: las 4 líneas (`gruporubio-web-1`, `gruporubio-medusa-1`, `gruporubio-postgres-1`, `gruporubio-redis-1`) en estado `Up`.

- [ ] **Step 2: Backup comprimido de ambas carpetas**

Run:
```bash
ssh root@116.202.27.5 "cd /opt/gruporubio && tar czf web.backup-$(date +%Y%m%d).tar.gz web && tar czf medusa.backup-$(date +%Y%m%d).tar.gz medusa && ls -la *.backup-*.tar.gz"
```
Expected: dos archivos `.tar.gz` listados con tamaño > 0.

- [ ] **Step 3: Verificar que los .env.production existen dentro del backup (son lo único insustituible)**

Run: `ssh root@116.202.27.5 "tar tzf web.backup-$(date +%Y%m%d).tar.gz | grep env.production; tar tzf medusa.backup-$(date +%Y%m%d).tar.gz | grep env.production"`

Cd al directorio correcto si el comando anterior no encuentra el archivo por la fecha (usar `ls /opt/gruporubio/*.tar.gz` para confirmar el nombre exacto generado).

Expected: una línea de salida por cada comando, mostrando la ruta del `.env.production` dentro del tar.

---

### Task 2: Convertir `/opt/gruporubio/web` en un clon git real

**Files:** ninguno en el repo local — operaciones en el VPS + una acción manual en github.com.

**Interfaces:**
- Consumes: backup de Task 1 (`web.backup-*.tar.gz`) como red de seguridad.
- Produces: `/opt/gruporubio/web` como clon git válido en `feature/tienda-medusa`, usado por Task 4 y Task 6.

- [ ] **Step 1: Generar el par de claves Deploy Key (solo lectura) en el VPS**

Run:
```bash
ssh root@116.202.27.5 "ssh-keygen -t ed25519 -f /root/.ssh/id_ed25519_deploy_web -N '' -C 'deploy-key-gruporubio-web'"
ssh root@116.202.27.5 "cat /root/.ssh/id_ed25519_deploy_web.pub"
```
Expected: imprime una línea `ssh-ed25519 AAAA... deploy-key-gruporubio-web`. Copiar ese texto completo.

- [ ] **Step 2: Registrar la Deploy Key en GitHub (manual, vía UI — el token no tiene permiso de escritura sobre este repo)**

Indicar al usuario: ir a `https://github.com/procesos-gr/gruporubio-web/settings/keys` → "Add deploy key" → Title: `VPS read-only clone` → pegar la clave pública del Step 1 → dejar "Allow write access" **sin marcar** → "Add key".

Esperar confirmación del usuario de que la clave fue añadida antes de continuar.

- [ ] **Step 3: Configurar el `ssh config` del VPS para usar esa clave con github.com**

Run:
```bash
ssh root@116.202.27.5 "cat >> /root/.ssh/config <<'EOF'

Host github-gruporubio-web
  HostName github.com
  User git
  IdentityFile /root/.ssh/id_ed25519_deploy_web
  IdentitiesOnly yes
EOF"
```
Expected: sin salida (el `cat` solo escribe al archivo).

- [ ] **Step 4: Clonar en una carpeta temporal y verificar acceso**

Run:
```bash
ssh root@116.202.27.5 "git clone --branch feature/tienda-medusa github-gruporubio-web:procesos-gr/gruporubio-web.git /opt/gruporubio/web.new"
```
Expected: `Cloning into '/opt/gruporubio/web.new'...` seguido de `done.`, sin errores de permisos.

- [ ] **Step 5: Copiar el `.env.production` real al clon nuevo**

Run:
```bash
ssh root@116.202.27.5 "cp /opt/gruporubio/web/.env.production /opt/gruporubio/web.new/.env.production"
```
Expected: sin salida. Verificar con `ssh root@116.202.27.5 "diff /opt/gruporubio/web/.env.production /opt/gruporubio/web.new/.env.production"` → sin diferencias.

- [ ] **Step 6: Sustituir la carpeta vieja por el clon nuevo**

Run:
```bash
ssh root@116.202.27.5 "mv /opt/gruporubio/web /opt/gruporubio/web.old && mv /opt/gruporubio/web.new /opt/gruporubio/web"
```
Expected: sin salida.

- [ ] **Step 7: Verificar que el build sigue funcionando igual desde el clon**

Run:
```bash
ssh root@116.202.27.5 "cd /opt/gruporubio && docker compose build web"
```
Expected: termina con `Successfully built` / sin errores (puede tardar 1-2 minutos).

- [ ] **Step 8: Levantar el contenedor reconstruido y confirmar que responde**

Run:
```bash
ssh root@116.202.27.5 "cd /opt/gruporubio && docker compose up -d web && sleep 5 && curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000"
```
Expected: `200`.

- [ ] **Step 9: Limpiar la carpeta vieja una vez confirmado que todo funciona**

Run: `ssh root@116.202.27.5 "rm -rf /opt/gruporubio/web.old"`
Expected: sin salida. (El backup `.tar.gz` de Task 1 sigue existiendo como red de seguridad adicional.)

---

### Task 3: Convertir `/opt/gruporubio/medusa` en un clon git real

**Files:** ninguno en el repo local — operaciones en el VPS, Deploy Key registrada por API (el token sí tiene admin sobre este repo).

**Interfaces:**
- Consumes: backup de Task 1 (`medusa.backup-*.tar.gz`).
- Produces: `/opt/gruporubio/medusa` como clon git válido en `main`, usado por Task 5 y Task 7.

- [ ] **Step 1: Generar el par de claves Deploy Key en el VPS**

Run:
```bash
ssh root@116.202.27.5 "ssh-keygen -t ed25519 -f /root/.ssh/id_ed25519_deploy_medusa -N '' -C 'deploy-key-gruporubio-medusa'"
ssh root@116.202.27.5 "cat /root/.ssh/id_ed25519_deploy_medusa.pub"
```
Expected: imprime `ssh-ed25519 AAAA... deploy-key-gruporubio-medusa`. Copiar el texto completo (sin el salto de línea final).

- [ ] **Step 2: Registrar la Deploy Key vía API (el token tiene admin aquí, no hace falta UI)**

Run (sustituir `<PUBKEY>` por el texto exacto del Step 1, entre comillas):
```bash
curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/modelaiprob-tech/gruporubio-medusa/keys \
  -d '{"title":"VPS read-only clone","key":"<PUBKEY>","read_only":true}'
```
Expected: JSON de respuesta con `"id"` numérico y `"read_only": true`. Si devuelve `"message":"key is already in use"`, generar una clave nueva (no reusar claves entre repos).

- [ ] **Step 3: Configurar el `ssh config` del VPS para esta clave**

Run:
```bash
ssh root@116.202.27.5 "cat >> /root/.ssh/config <<'EOF'

Host github-gruporubio-medusa
  HostName github.com
  User git
  IdentityFile /root/.ssh/id_ed25519_deploy_medusa
  IdentitiesOnly yes
EOF"
```
Expected: sin salida.

- [ ] **Step 4: Clonar en carpeta temporal**

Run:
```bash
ssh root@116.202.27.5 "git clone --branch main github-gruporubio-medusa:modelaiprob-tech/gruporubio-medusa.git /opt/gruporubio/medusa.new"
```
Expected: `Cloning into '/opt/gruporubio/medusa.new'...` seguido de `done.`.

- [ ] **Step 5: Copiar el `.env.production` real**

Run:
```bash
ssh root@116.202.27.5 "cp /opt/gruporubio/medusa/.env.production /opt/gruporubio/medusa.new/.env.production"
ssh root@116.202.27.5 "diff /opt/gruporubio/medusa/.env.production /opt/gruporubio/medusa.new/.env.production"
```
Expected: el `diff` no muestra ninguna línea (archivos idénticos).

- [ ] **Step 6: Sustituir la carpeta vieja**

Run:
```bash
ssh root@116.202.27.5 "mv /opt/gruporubio/medusa /opt/gruporubio/medusa.old && mv /opt/gruporubio/medusa.new /opt/gruporubio/medusa"
```
Expected: sin salida.

- [ ] **Step 7: Verificar build**

Run: `ssh root@116.202.27.5 "cd /opt/gruporubio && docker compose build medusa"`
Expected: termina sin errores.

- [ ] **Step 8: Levantar y confirmar que el API de Medusa responde**

Run:
```bash
ssh root@116.202.27.5 "cd /opt/gruporubio && docker compose up -d medusa && sleep 8 && curl -s -o /dev/null -w '%{http_code}\n' http://localhost:9000/health"
```
Expected: `200`.

- [ ] **Step 9: Limpiar carpeta vieja**

Run: `ssh root@116.202.27.5 "rm -rf /opt/gruporubio/medusa.old"`
Expected: sin salida.

---

### Task 4: Script de deploy + clave de CI para web

**Files:**
- Create (en el VPS, no en el repo): `/opt/gruporubio/deploy-web.sh`

**Interfaces:**
- Consumes: clon git de Task 2 en `/opt/gruporubio/web`.
- Produces: script ejecutable que Task 6 invocará desde GitHub Actions; secret `VPS_CI_KEY_WEB` y `VPS_HOST` en GitHub.

- [ ] **Step 1: Escribir el script de deploy en el VPS**

Run:
```bash
ssh root@116.202.27.5 "cat > /opt/gruporubio/deploy-web.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
cd /opt/gruporubio/web
git fetch origin
git reset --hard origin/feature/tienda-medusa
cd /opt/gruporubio
docker compose build web
docker compose up -d web
echo \"deploy-web OK: \$(git -C /opt/gruporubio/web rev-parse --short HEAD)\"
EOF"
ssh root@116.202.27.5 "chmod +x /opt/gruporubio/deploy-web.sh"
```
Expected: sin salida del primer comando; sin salida del `chmod`.

- [ ] **Step 2: Probar el script manualmente antes de conectarlo a Actions**

Run: `ssh root@116.202.27.5 "/opt/gruporubio/deploy-web.sh"`
Expected: termina con una línea `deploy-web OK: <hash-corto>` que coincide con `git -C /opt/gruporubio/web rev-parse --short HEAD` en el repo local.

- [ ] **Step 3: Generar el par de claves de CI (en la máquina local, no en el VPS)**

Run:
```bash
ssh-keygen -t ed25519 -f ~/.ssh/gr_ci_web -N "" -C "ci-deploy-web"
cat ~/.ssh/gr_ci_web.pub
```
Expected: imprime `ssh-ed25519 AAAA... ci-deploy-web`. Copiar el texto completo.

- [ ] **Step 4: Instalar la clave pública en el VPS con comando forzado**

Run (sustituir `<PUBKEY>` por el texto exacto del Step 3):
```bash
ssh root@116.202.27.5 "echo 'command=\"/opt/gruporubio/deploy-web.sh\",no-agent-forwarding,no-X11-forwarding,no-port-forwarding <PUBKEY>' >> /root/.ssh/authorized_keys"
```
Expected: sin salida.

- [ ] **Step 5: Verificar que la clave de CI solo puede ejecutar el script, no una shell libre**

Run: `ssh -i ~/.ssh/gr_ci_web root@116.202.27.5 "whoami; ls /root"`
Expected: la salida es el resultado de `deploy-web.sh` (incluye `deploy-web OK: ...`), **no** `whoami` ni `ls` — confirma que el comando forzado ignora lo que se pidió.

- [ ] **Step 6: Añadir los secrets en GitHub (manual, vía UI)**

Indicar al usuario: ir a `https://github.com/procesos-gr/gruporubio-web/settings/secrets/actions` → "New repository secret":
  - `VPS_HOST` = `116.202.27.5`
  - `VPS_CI_KEY` = contenido completo de `~/.ssh/gr_ci_web` (la clave **privada**, incluyendo las líneas `-----BEGIN/END-----`)

Esperar confirmación del usuario de que ambos secrets están creados.

- [ ] **Step 7: Borrar la clave privada del disco local (ya está en GitHub Secrets, no debe quedar duplicada)**

Run: `rm ~/.ssh/gr_ci_web`
Expected: sin salida. (`~/.ssh/gr_ci_web.pub` se puede dejar o borrar también, ya no es sensible.)

---

### Task 5: Script de deploy + clave de CI para medusa

**Files:**
- Create (en el VPS): `/opt/gruporubio/deploy-medusa.sh`

**Interfaces:**
- Consumes: clon git de Task 3 en `/opt/gruporubio/medusa`.
- Produces: script ejecutable que Task 7 invocará desde GitHub Actions; secrets en el repo de medusa.

- [ ] **Step 1: Escribir el script de deploy con paso de migraciones**

Run:
```bash
ssh root@116.202.27.5 "cat > /opt/gruporubio/deploy-medusa.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
cd /opt/gruporubio/medusa
git fetch origin
git reset --hard origin/main
cd /opt/gruporubio
docker compose build medusa
docker compose run --rm medusa medusa db:migrate
docker compose up -d medusa
echo \"deploy-medusa OK: \$(git -C /opt/gruporubio/medusa rev-parse --short HEAD)\"
EOF"
ssh root@116.202.27.5 "chmod +x /opt/gruporubio/deploy-medusa.sh"
```
Expected: sin salida.

- [ ] **Step 2: Probar el script manualmente**

Run: `ssh root@116.202.27.5 "/opt/gruporubio/deploy-medusa.sh"`
Expected: las migraciones corren sin error (o informan "no pending migrations" si ya estaban aplicadas) y termina con `deploy-medusa OK: <hash-corto>`.

- [ ] **Step 3: Generar el par de claves de CI**

Run:
```bash
ssh-keygen -t ed25519 -f ~/.ssh/gr_ci_medusa -N "" -C "ci-deploy-medusa"
cat ~/.ssh/gr_ci_medusa.pub
```
Expected: imprime la clave pública.

- [ ] **Step 4: Instalar la clave pública en el VPS con comando forzado**

Run (sustituir `<PUBKEY>`):
```bash
ssh root@116.202.27.5 "echo 'command=\"/opt/gruporubio/deploy-medusa.sh\",no-agent-forwarding,no-X11-forwarding,no-port-forwarding <PUBKEY>' >> /root/.ssh/authorized_keys"
```
Expected: sin salida.

- [ ] **Step 5: Verificar el comando forzado**

Run: `ssh -i ~/.ssh/gr_ci_medusa root@116.202.27.5 "rm -rf /"`
Expected: la salida es la de `deploy-medusa.sh` (no se ejecuta `rm -rf /` bajo ninguna circunstancia) — esta es la prueba de seguridad más importante del plan, confirmar literalmente que el contenedor medusa sigue arriba después con `ssh root@116.202.27.5 "docker ps --format '{{.Names}}: {{.Status}}'"`.

- [ ] **Step 6: Añadir los secrets en GitHub (API, el token tiene admin sobre este repo — pero la encriptación de secrets requiere la clave pública del repo; más simple hacerlo también por UI para evitar dependencias de criptografía)**

Indicar al usuario: ir a `https://github.com/modelaiprob-tech/gruporubio-medusa/settings/secrets/actions` → "New repository secret":
  - `VPS_HOST` = `116.202.27.5`
  - `VPS_CI_KEY` = contenido completo de `~/.ssh/gr_ci_medusa` (clave privada completa)

Esperar confirmación del usuario.

- [ ] **Step 7: Borrar la clave privada del disco local**

Run: `rm ~/.ssh/gr_ci_medusa`
Expected: sin salida.

---

### Task 6: Workflow de GitHub Actions para web

**Files:**
- Create: `gruporubio-web/.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: secrets `VPS_HOST` y `VPS_CI_KEY` de Task 4.
- Produces: deploy automático en cada push a `feature/tienda-medusa`.

- [ ] **Step 1: Crear el workflow**

Create `C:\Users\Ayoub\Proyectos\gruporubio-web\.github\workflows\deploy.yml`:
```yaml
name: Deploy to VPS

on:
  push:
    branches: [feature/tienda-medusa]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: root
          key: ${{ secrets.VPS_CI_KEY }}
          script: echo "deploy triggered"
```
(El `script` real no importa — el `command=` forzado en `authorized_keys` del VPS ignora lo que se pida y siempre ejecuta `deploy-web.sh`.)

- [ ] **Step 2: Commit y push de un cambio trivial para probar el pipeline**

Run:
```bash
cd "C:/Users/Ayoub/Proyectos/gruporubio-web"
git add .github/workflows/deploy.yml
git commit -m "ci: workflow de deploy automático al VPS en push a feature/tienda-medusa"
git push origin feature/tienda-medusa
```
Expected: push exitoso.

- [ ] **Step 3: Verificar en GitHub que el Action corrió y terminó en verde**

Indicar al usuario: revisar `https://github.com/procesos-gr/gruporubio-web/actions` → el run más reciente debe estar en verde (✓).

- [ ] **Step 4: Confirmar que el VPS realmente se actualizó**

Run:
```bash
ssh root@116.202.27.5 "git -C /opt/gruporubio/web rev-parse --short HEAD"
git -C "C:/Users/Ayoub/Proyectos/gruporubio-web" rev-parse --short HEAD
```
Expected: ambos hashes coinciden.

- [ ] **Step 5: Confirmar que la web sigue respondiendo**

Run: `curl -s -o /dev/null -w '%{http_code}\n' http://116.202.27.5:3000`
Expected: `200`.

---

### Task 7: Workflow de GitHub Actions para medusa

**Files:**
- Create: `gruporubio-medusa/.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: secrets `VPS_HOST` y `VPS_CI_KEY` de Task 5.
- Produces: deploy automático en cada push a `main`.

- [ ] **Step 1: Crear el workflow**

Create `C:\Users\Ayoub\Proyectos\gruporubio-medusa\.github\workflows\deploy.yml`:
```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: root
          key: ${{ secrets.VPS_CI_KEY }}
          script: echo "deploy triggered"
```

- [ ] **Step 2: Commit y push de un cambio trivial**

Run:
```bash
cd "C:/Users/Ayoub/Proyectos/gruporubio-medusa"
git add .github/workflows/deploy.yml
git commit -m "ci: workflow de deploy automático al VPS en push a main"
git push origin main
```
Expected: push exitoso.

- [ ] **Step 3: Verificar en GitHub que el Action corrió en verde**

Indicar al usuario: revisar `https://github.com/modelaiprob-tech/gruporubio-medusa/actions`.

- [ ] **Step 4: Confirmar hash y migraciones**

Run:
```bash
ssh root@116.202.27.5 "git -C /opt/gruporubio/medusa rev-parse --short HEAD"
git -C "C:/Users/Ayoub/Proyectos/gruporubio-medusa" rev-parse --short HEAD
ssh root@116.202.27.5 "docker compose -f /opt/gruporubio/docker-compose.yml logs medusa --tail 20"
```
Expected: hashes coinciden; logs sin errores de migración.

- [ ] **Step 5: Confirmar que el API responde**

Run: `curl -s -o /dev/null -w '%{http_code}\n' http://116.202.27.5:9000/health`
Expected: `200`.

---

### Task 8: Prueba de fallo controlado (confirmar que un deploy roto no tira el servicio)

**Files:** ninguno — prueba operativa directa contra el VPS, sin tocar la rama de deploy real.

**Interfaces:**
- Consumes: `deploy-web.sh` de Task 4.
- Produces: confirmación documentada de que el `set -euo pipefail` protege el servicio en producción.

- [ ] **Step 1: Anotar el commit actualmente corriendo**

Run: `ssh root@116.202.27.5 "git -C /opt/gruporubio/web rev-parse HEAD"`
Expected: un hash, guardarlo para comparar después.

- [ ] **Step 2: Provocar un build roto manualmente en el VPS (sin pasar por git, para no ensuciar el historial real)**

Run:
```bash
ssh root@116.202.27.5 "cp /opt/gruporubio/web/Dockerfile /opt/gruporubio/web/Dockerfile.bak"
ssh root@116.202.27.5 "echo 'RUN exit 1' >> /opt/gruporubio/web/Dockerfile"
```
Expected: sin salida.

- [ ] **Step 3: Ejecutar el script de deploy (no el de Actions, directamente) y confirmar que aborta**

Run: `ssh root@116.202.27.5 "cd /opt/gruporubio && docker compose build web; echo EXIT_CODE=\$?"`
Expected: `EXIT_CODE` distinto de `0` (el build falla por el `RUN exit 1`).

- [ ] **Step 4: Confirmar que el contenedor viejo sigue sirviendo tráfico durante el fallo**

Run: `curl -s -o /dev/null -w '%{http_code}\n' http://116.202.27.5:3000`
Expected: `200` (el contenedor anterior nunca se detuvo porque `docker compose up -d` nunca se llegó a ejecutar tras el build roto).

- [ ] **Step 5: Restaurar el Dockerfile real**

Run:
```bash
ssh root@116.202.27.5 "mv /opt/gruporubio/web/Dockerfile.bak /opt/gruporubio/web/Dockerfile"
ssh root@116.202.27.5 "cd /opt/gruporubio/web && git status"
```
Expected: `git status` muestra el repo limpio otra vez (sin cambios pendientes) — si muestra `Dockerfile` modificado, el `mv` no se completó bien, repetir el Step 5.

---

### Task 9: Limpieza final y documentación

**Files:**
- Modify: `docs/superpowers/specs/2026-06-22-vps-deploy-pipeline-design.md` (gruporubio-web) — añadir nota de estado
- Modify: `TAREAS.md` en el vault Obsidian (`01-Proyectos\Grupo-Rubio-App\TAREAS.md`)

**Interfaces:** ninguna — tarea de cierre, no produce nada que otras tareas consuman.

- [ ] **Step 1: Borrar los backups `.tar.gz` y carpetas `.old` si quedó alguna**

Run: `ssh root@116.202.27.5 "ls /opt/gruporubio/*.backup-*.tar.gz /opt/gruporubio/*.old 2>/dev/null"`

Si el plan se ejecutó completo y todo en Tasks 6-8 verificó en verde, borrar:
```bash
ssh root@116.202.27.5 "rm -f /opt/gruporubio/*.backup-*.tar.gz"
```
Expected: sin salida. (Si algo en el plan falló y no se resolvió, NO borrar los backups todavía.)

- [ ] **Step 2: Marcar el spec como implementado**

Edit `docs/superpowers/specs/2026-06-22-vps-deploy-pipeline-design.md`, cambiar la línea de estado:
```diff
-**Estado:** Aprobado, pendiente de implementación
+**Estado:** Implementado (2026-06-22)
```

- [ ] **Step 3: Actualizar TAREAS.md del proyecto**

Edit `C:\Users\Ayoub\Proyectos\Obsidian\AyoubBrain_clean\01-Proyectos\Grupo-Rubio-App\TAREAS.md`, añadir bajo la sección de despliegue:
```markdown
- [x] **Pipeline CI/CD VPS** — push a `feature/tienda-medusa` (web) o `main` (medusa) despliega automático vía GitHub Actions + SSH con comando forzado — hecho (2026-06-22)
```

- [ ] **Step 4: Commit final en ambos repos**

Run:
```bash
cd "C:/Users/Ayoub/Proyectos/gruporubio-web"
git add docs/superpowers/specs/2026-06-22-vps-deploy-pipeline-design.md
git commit -m "docs: marca el pipeline de deploy como implementado"
git push origin feature/tienda-medusa
```
Expected: push exitoso.

- [ ] **Step 5: Log de sesión en español en el LOG.md del proyecto**

Edit `C:\Users\Ayoub\Proyectos\Obsidian\AyoubBrain_clean\01-Proyectos\Grupo-Rubio-App\LOG.md`, añadir entrada al principio con fecha 2026-06-22 resumiendo: pipeline CI/CD montado para web+medusa, las dos carpetas del VPS convertidas a clones git, claves de Deploy Key y CI con comando forzado, probado con deploy real y con fallo controlado.
