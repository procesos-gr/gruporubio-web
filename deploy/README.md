# Deploy en Hetzner VPS

## Requisitos en el VPS
- Ubuntu 24.04 LTS
- Docker + Docker Compose v2
- Certbot para SSL

## Pasos de despliegue

### 1. Clonar ambos repos en el VPS
```bash
git clone git@github.com:TU_ORG/gruporubio-web.git
git clone git@github.com:TU_ORG/gruporubio-medusa.git
```
Los dos repos deben estar en el mismo directorio padre.

### 2. Configurar variables de entorno
```bash
cd gruporubio-web/deploy
cp .env.web.template .env.web
cp .env.medusa.template .env.medusa
cp .env.compose.template .env
# Editar cada archivo con los valores reales
```

### 3. Obtener certificados SSL (primera vez)
```bash
apt install certbot
certbot certonly --standalone -d gruporubio.es -d www.gruporubio.es
certbot certonly --standalone -d api.gruporubio.es
```

### 4. Arrancar servicios
```bash
cd gruporubio-web/deploy
docker compose up -d --build
```

### 5. Migraciones y seed (primera vez)
```bash
docker compose exec medusa npx medusa db:migrate
docker compose exec medusa npx medusa exec src/scripts/seed.ts
```

### Actualizar tras nuevos commits
```bash
git pull
cd gruporubio-web/deploy
docker compose up -d --build web      # Solo frontend
docker compose up -d --build medusa   # Solo backend
```
