# 🐳 Running LiveKit Dashboard with Docker

## Quick Start

```bash
# Start the application
docker compose up

# Access the dashboard
open http://localhost:5173
```

That's it! The application is now running in Docker.

## ⚠️ Expected Behavior on First Run

When you first start the application with Docker, you'll see **error messages** in both the browser console and Docker logs. **This is completely normal!**

### Why You See Errors

```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Failed to get rooms: Error: Unknown error
```

These errors occur because:

1. **No LiveKit server is configured yet** - The application doesn't have valid LiveKit credentials
2. **Auto-retry behavior** - React Query automatically retries failed requests
3. **This is expected** - The dashboard needs LiveKit credentials before it can fetch room data

### How to Fix

**Configure your LiveKit credentials in the Settings page:**

1. Open http://localhost:5173 in your browser
2. Click the **Settings** icon (⚙️) in the sidebar
3. Enter your LiveKit server details:
   - **Server URL**: `ws://your-livekit-server:7880` (or your server's URL)
   - **API Key**: Your LiveKit API key
   - **API Secret**: Your LiveKit API secret
4. Click **"Test Connection"** to verify
5. Click **"Save Configuration"**

Once configured, the errors will stop and you'll see your rooms data!

## 📦 What's Running

- **Frontend** (Vite + React): http://localhost:5173
- **Backend** (Node.js + Express): http://localhost:3001/api

## 🔧 Configuration Options

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example
cp .env.example .env
```

Edit `.env` to customize:

```env
# Service ports
BACKEND_PORT=3001
FRONTEND_PORT=5173

# Optional: Default LiveKit credentials
# (Can also be configured via UI Settings page)
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

**Note**: Setting credentials in `.env` is optional. You can always configure them via the Settings page in the UI.

### Restart After Configuration Changes

If you update `.env` file:

```bash
docker compose down
docker compose up
```

## 🔥 Hot Reload (Development Mode)

The application runs in development mode by default with **hot reload enabled**:

- ✅ **Frontend**: Vite HMR - changes reflect instantly
- ✅ **Backend**: Nodemon - automatically restarts on file changes

### Making Code Changes

1. Edit files in `frontend/src/` or `backend/src/`
2. Save the file
3. Changes automatically reload in the container
4. Refresh your browser to see frontend changes

## 🐛 Troubleshooting

### "500 Internal Server Error" on Dashboard

**Cause**: No LiveKit server configured

**Solution**: Configure LiveKit credentials in Settings page (see above)

### Backend Container Shows "unhealthy"

**Cause**: Health check endpoint not responding

**Check**:
```bash
# View backend logs
docker compose logs backend

# Test health endpoint
curl http://localhost:3001/api/health
```

**Solution**: Restart backend
```bash
docker compose restart backend
```

### Frontend Can't Connect to Backend

**Check network**:
```bash
docker compose ps
```

Both services should show "Up" status.

**Solution**: Restart all services
```bash
docker compose down
docker compose up
```

### Changes Not Reflecting (Hot Reload Not Working)

**Solution**: Restart the specific service
```bash
# Restart frontend
docker compose restart frontend

# Restart backend
docker compose restart backend
```

### Port Already in Use

**Error**: `Bind for 0.0.0.0:5173 failed: port is already allocated`

**Solution**: Change ports in `.env`:
```env
FRONTEND_PORT=8080
BACKEND_PORT=3002
```

## 📊 Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend

# Last N lines
docker compose logs --tail=50 backend
```

## 🛑 Stopping the Application

```bash
# Stop services (keeps volumes)
docker compose stop

# Stop and remove containers
docker compose down

# Stop and remove everything including volumes
docker compose down -v
```

## 🚀 Production Deployment

For production, use the production compose file:

```bash
# Build and start production containers
docker compose -f docker-compose.prod.yml up -d

# Access on port 80
open http://localhost
```

**Production features**:
- ✅ Optimized builds with multi-stage Dockerfiles
- ✅ nginx serving frontend with gzip compression
- ✅ Minimal Alpine Linux base images
- ✅ Health checks for monitoring
- ✅ Security hardening (non-root users)

## 📚 Additional Documentation

- **Full Docker Guide**: [`DOCKER.md`](./DOCKER.md)
- **Quick Reference**: [`DOCKER_QUICKSTART.md`](./DOCKER_QUICKSTART.md)
- **Main README**: [`README.md`](./README.md)

## 💡 Pro Tips

1. **Use detached mode** to run in background:
   ```bash
   docker compose up -d
   ```

2. **Rebuild after dependency changes**:
   ```bash
   docker compose up --build
   ```

3. **Clean slate** (remove everything):
   ```bash
   docker compose down -v --rmi all
   docker compose up --build
   ```

4. **Check container resource usage**:
   ```bash
   docker stats
   ```

## ✅ Health Check

To verify everything is running correctly:

```bash
# Check container status
docker compose ps

# Should show:
# - backend: Up (healthy)
# - frontend: Up (healthy)

# Test endpoints
curl http://localhost:3001/api/health  # Backend
curl http://localhost:5173             # Frontend
```

## 🎯 Next Steps

1. ✅ Start containers: `docker compose up`
2. ✅ Open browser: http://localhost:5173
3. ✅ Configure LiveKit in Settings
4. ✅ Start monitoring your rooms!

---

**Need help?** Check out the [full Docker documentation](./DOCKER.md) or [open an issue](https://github.com/Murtazokh/livekit-dashboard/issues).
