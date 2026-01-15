# Docker Deployment Guide

This guide explains how to run the LiveKit Dashboard using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose 2.0+ (included with Docker Desktop)

## Quick Start

### Development Mode (with Hot Reload)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd livekit-dashboard
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` if you need to customize ports or add default LiveKit credentials.

3. **Start the application**:
   ```bash
   docker compose up
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

5. **Stop the application**:
   ```bash
   docker compose down
   ```

### Production Mode

1. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:
   ```env
   NODE_ENV=production
   FRONTEND_PORT=80
   FRONTEND_URL=http://your-domain.com
   ```

2. **Start in production mode**:
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

3. **Access the application**:
   - Frontend: http://localhost (or your configured domain)
   - Backend API: http://localhost:3001

4. **View logs**:
   ```bash
   docker compose -f docker-compose.prod.yml logs -f
   ```

5. **Stop the application**:
   ```bash
   docker compose -f docker-compose.prod.yml down
   ```

## Architecture

### Services

1. **Backend** (`backend` service)
   - Node.js + Express + TypeScript
   - Port: 3001 (configurable via `BACKEND_PORT`)
   - Hot reload in development mode
   - Multi-stage build for optimization

2. **Frontend** (`frontend` service)
   - React + Vite + TypeScript
   - Development: Port 5173 (Vite dev server with HMR)
   - Production: Port 80 (nginx serving static files)
   - Hot reload in development mode

### Networking

- Services communicate via Docker network: `livekit-dashboard-network`
- Frontend proxies `/api` requests to backend service
- Backend accessible to frontend via service name: `backend:3001`

### Volumes

Development mode uses named volumes for `node_modules` to:
- Avoid conflicts between host and container
- Speed up container startup
- Preserve dependencies between rebuilds

## Environment Variables

### Required Variables

None - the application works with defaults.

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NODE_ENV` | Environment mode | `development` | `production` |
| `BACKEND_PORT` | Backend API port | `3001` | `3001` |
| `FRONTEND_PORT` | Frontend web port | `5173` (dev), `80` (prod) | `8080` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` | `https://dashboard.example.com` |
| `VITE_API_URL` | Backend URL for frontend | `http://localhost:3001` | `https://api.example.com` |
| `LIVEKIT_URL` | Default LiveKit server URL | - | `ws://localhost:7880` |
| `LIVEKIT_API_KEY` | Default LiveKit API key | - | `your-api-key` |
| `LIVEKIT_API_SECRET` | Default LiveKit API secret | - | `your-api-secret` |

**Note**: LiveKit credentials are optional defaults. The application primarily uses credentials configured in the UI Settings page, which are passed via HTTP headers on each request.

## Docker Commands Reference

### Build Commands

```bash
# Build all services
docker compose build

# Build specific service
docker compose build backend
docker compose build frontend

# Build without cache (force fresh build)
docker compose build --no-cache

# Build production images
docker compose -f docker-compose.prod.yml build
```

### Run Commands

```bash
# Start in foreground (see logs)
docker compose up

# Start in background (detached)
docker compose up -d

# Start specific service
docker compose up backend

# Start with rebuild
docker compose up --build

# Start production
docker compose -f docker-compose.prod.yml up -d
```

### Stop Commands

```bash
# Stop services (preserve volumes)
docker compose stop

# Stop and remove containers
docker compose down

# Stop and remove everything (including volumes)
docker compose down -v

# Stop production
docker compose -f docker-compose.prod.yml down
```

### Logs Commands

```bash
# View all logs
docker compose logs

# Follow logs (real-time)
docker compose logs -f

# View specific service logs
docker compose logs backend
docker compose logs frontend

# Tail last N lines
docker compose logs --tail=100 backend
```

### Utility Commands

```bash
# List running services
docker compose ps

# Execute command in container
docker compose exec backend sh
docker compose exec frontend sh

# View resource usage
docker stats

# Restart specific service
docker compose restart backend

# View service health
docker compose ps
```

## Troubleshooting

### Port Already in Use

If you see "port is already allocated" error:

1. Check which process is using the port:
   ```bash
   # Linux/Mac
   lsof -i :5173
   lsof -i :3001

   # Windows
   netstat -ano | findstr :5173
   netstat -ano | findstr :3001
   ```

2. Stop the conflicting process or change the port in `.env`:
   ```env
   FRONTEND_PORT=8080
   BACKEND_PORT=3002
   ```

### Container Fails to Start

1. Check logs:
   ```bash
   docker compose logs backend
   docker compose logs frontend
   ```

2. Verify environment variables:
   ```bash
   docker compose config
   ```

3. Rebuild without cache:
   ```bash
   docker compose down -v
   docker compose build --no-cache
   docker compose up
   ```

### Hot Reload Not Working

1. Ensure volumes are properly mounted:
   ```bash
   docker compose ps
   ```

2. Check file permissions (Linux/Mac):
   ```bash
   ls -la backend/src
   ls -la frontend/src
   ```

3. Try restarting the service:
   ```bash
   docker compose restart frontend
   ```

### Cannot Connect to Backend

1. Check backend health:
   ```bash
   docker compose ps backend
   curl http://localhost:3001/api/health
   ```

2. Verify network:
   ```bash
   docker network inspect livekit-dashboard-network
   ```

3. Check frontend proxy configuration in `vite.config.ts`

### Clean Slate

To completely reset your Docker environment:

```bash
# Stop and remove everything
docker compose down -v

# Remove images
docker compose down --rmi all

# Prune Docker system (removes unused images, containers, volumes)
docker system prune -a --volumes

# Start fresh
docker compose up --build
```

## Production Deployment

### Security Checklist

- [ ] Use environment variables for all secrets
- [ ] Never commit `.env` files
- [ ] Use strong LiveKit API credentials
- [ ] Enable HTTPS (use reverse proxy like nginx or Traefik)
- [ ] Set proper CORS origins in `FRONTEND_URL`
- [ ] Review nginx security headers in `frontend/nginx.conf`
- [ ] Keep Docker images updated
- [ ] Implement rate limiting at reverse proxy level

### Recommended Setup

For production deployments, it's recommended to:

1. **Use a reverse proxy** (nginx, Traefik, Caddy) in front of the application
2. **Enable HTTPS** with Let's Encrypt certificates
3. **Set up health checks** in your orchestration tool
4. **Configure log aggregation** (ELK, Loki, CloudWatch)
5. **Set up monitoring** (Prometheus, Grafana, Datadog)
6. **Use Docker secrets** for sensitive data

Example nginx reverse proxy config:

```nginx
server {
    listen 80;
    server_name dashboard.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dashboard.example.com;

    ssl_certificate /etc/letsencrypt/live/dashboard.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dashboard.example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Advanced Configuration

### Custom Network

To use a custom Docker network:

```yaml
networks:
  livekit-network:
    external: true
    name: my-custom-network
```

### Health Checks

Both services include health checks. Monitor them:

```bash
docker compose ps
# Look for "healthy" status
```

### Resource Limits

Add resource limits in `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Contributing

When adding new dependencies or changing configurations:

1. Update Dockerfiles if needed
2. Test both development and production builds
3. Update this documentation
4. Verify hot reload still works

## Support

For issues specific to Docker deployment, check:
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Project Issues](https://github.com/your-repo/issues)
