# 🐳 Docker Quick Start

Get the LiveKit Dashboard running with Docker in under 30 seconds!

## TL;DR - One Command

```bash
# Development (with hot reload)
docker compose up

# Production
docker compose -f docker-compose.prod.yml up -d
```

That's it! 🎉

## Access Your Dashboard

**Development Mode:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001/api

**Production Mode:**
- Frontend: http://localhost
- Backend: http://localhost:3001/api

## What's Included?

### ✨ Development Features
- **Hot Reload** - Changes reflect instantly without restart
- **Fast Builds** - Optimized Docker layer caching
- **Source Volumes** - Edit code on host, run in container
- **Live Logs** - See everything happening in real-time

### 🚀 Production Features
- **Optimized Builds** - Multi-stage builds for minimal image size
- **nginx** - Static file serving with compression
- **Health Checks** - Automatic service health monitoring
- **Security** - Non-root user, minimal attack surface

## Common Commands

```bash
# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild and start
docker compose up --build

# Clean everything
docker compose down -v --rmi all
```

## Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` to customize:
- Port numbers
- LiveKit credentials (optional defaults)
- Environment settings

## Need Help?

📖 **[Full Docker Documentation →](./DOCKER.md)**

Contains:
- Detailed architecture explanation
- Troubleshooting guide
- Production deployment best practices
- Advanced configuration options
- Security checklist

## File Structure

```
.
├── docker-compose.yml          # Development setup
├── docker-compose.prod.yml     # Production setup
├── .env.example                # Environment template
├── backend/
│   ├── Dockerfile              # Backend container
│   └── .dockerignore           # Ignore patterns
└── frontend/
    ├── Dockerfile              # Frontend container
    ├── nginx.conf              # Production web server
    └── .dockerignore           # Ignore patterns
```

## Why Docker?

✅ **Consistency** - Same environment everywhere
✅ **Isolation** - No conflicts with host system
✅ **Portability** - Works on any OS with Docker
✅ **Scalability** - Easy to deploy anywhere
✅ **Fast Setup** - No manual dependency installation

---

**Ready to deploy?** Check out [DOCKER.md](./DOCKER.md) for production deployment guides!
