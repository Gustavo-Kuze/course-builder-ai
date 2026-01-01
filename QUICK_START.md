# Quick Start - CourseBuilderAI Local Setup

## 🚀 One-Command Deploy

```bash
# 1. Set your API key
echo "GROQ_API_KEY=gsk_your_key_here" > .env.local

# 2. Run deployment
./deploy.sh
```

## 📋 Manual Setup

### Prerequisites
- ✅ PM2 installed
- ✅ Caddy installed
- ✅ Bun installed
- ✅ Groq API key

### Steps

```bash
# 1. Install dependencies
bun install

# 2. Set environment variable
nano .env.local
# Add: GROQ_API_KEY=gsk_your_key_here

# 3. Build
bun run build

# 4. Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save

# 5. Configure Caddy (one-time)
sudo nano /etc/caddy/Caddyfile
# Add the configuration from ./Caddyfile

# 6. Reload Caddy
sudo systemctl reload caddy
```

## 🧪 Test It Works

```bash
# Test direct access
curl http://localhost:3005/

# Test via Caddy
curl http://localhost:8080/

# Test API endpoint
curl -X POST http://localhost:3005/api/course/blueprint \
  -H "Content-Type: application/json" \
  -d @examples/1-blueprint-request-beginner.json
```

## 🌐 Access URLs

- **Direct**: http://localhost:3005
- **Via Caddy**: http://localhost:8080
- **Swagger UI**: http://localhost:3005/api-docs

## 🔧 Common Commands

```bash
# View status
pm2 status

# View logs
pm2 logs course-builder-ai

# Restart app
pm2 restart course-builder-ai

# Stop app
pm2 stop course-builder-ai

# Remove app
pm2 delete course-builder-ai
```

## 🐛 Debugging

If Swagger UI shows "Load failed":

1. **Check app is running**: `pm2 status`
2. **Check logs**: `pm2 logs course-builder-ai`
3. **Test API directly**: See test commands above
4. **Read detailed guide**: `cat DEBUG_GUIDE.md`

## 📚 Documentation

- `README.md` - Full project documentation
- `DEBUG_GUIDE.md` - Comprehensive debugging guide
- `CORS_FIX.md` - CORS configuration details
- `SWAGGER_DOCS.md` - Swagger UI usage
- `examples/` - API request examples

## 🆘 Get Help

If stuck, run diagnostic:

```bash
pm2 status
pm2 logs course-builder-ai --lines 50
curl -v http://localhost:3005/
```

Then check `DEBUG_GUIDE.md` for solutions.
