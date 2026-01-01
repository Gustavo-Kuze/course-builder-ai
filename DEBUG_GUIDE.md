# Debug Guide: CourseBuilderAI with PM2 and Caddy

## Quick Setup

### 1. Set Your API Key

```bash
# Edit .env.local and add your Groq API key
nano .env.local

# Add this line:
GROQ_API_KEY=gsk_your_actual_key_here
```

### 2. Deploy with PM2

```bash
# Run the deployment script
./deploy.sh

# Or manually:
bun install
bun run build
pm2 start ecosystem.config.js --env production
pm2 save
```

### 3. Configure Caddy

```bash
# Option A: Append to existing Caddyfile
sudo bash -c 'cat Caddyfile >> /etc/caddy/Caddyfile'

# Option B: Manual edit
sudo nano /etc/caddy/Caddyfile
# Then paste the contents from the Caddyfile in this directory

# Reload Caddy
sudo systemctl reload caddy
```

## Debugging the "Load failed" Error

### Step 1: Verify Application is Running

```bash
# Check PM2 status
pm2 status

# Should show course-builder-ai as 'online'
# If status is 'errored' or 'stopped', check logs:
pm2 logs course-builder-ai --lines 50
```

### Step 2: Test Direct API Access

```bash
# Test if the app responds on localhost:3005
curl http://localhost:3005/

# Test the API endpoint directly
curl -X POST http://localhost:3005/api/course/blueprint \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "audience": "Developers",
    "level": "beginner",
    "goal": "Learn",
    "teachingStyle": "Practical",
    "language": "English"
  }'
```

**Expected**: JSON response with course blueprint
**If fails**: Check application logs and environment variables

### Step 3: Test Through Caddy

```bash
# Test via Caddy (local)
curl http://localhost:8080/

# Test API through Caddy
curl -X POST http://localhost:8080/api/course/blueprint \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "audience": "Developers",
    "level": "beginner",
    "goal": "Learn",
    "teachingStyle": "Practical",
    "language": "English"
  }'
```

**Expected**: Same JSON response
**If fails**: Check Caddy configuration and logs

### Step 4: Check CORS Headers

```bash
# Check if CORS headers are present
curl -I -X OPTIONS http://localhost:3005/api/course/blueprint \
  -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: POST"

# Should see these headers in response:
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
# Access-Control-Allow-Headers: Content-Type, Authorization
```

**If missing**: API routes not returning CORS headers - check code

### Step 5: Test Swagger UI

```bash
# Open in browser
firefox http://localhost:3005/api-docs
# or
chromium http://localhost:3005/api-docs

# Try executing a request through Swagger UI
# Watch browser console for errors (F12 -> Console tab)
```

## Common Issues and Solutions

### Issue 1: Application Won't Start

**Symptom**: PM2 shows status as 'errored'

```bash
# Check logs
pm2 logs course-builder-ai --lines 100

# Common causes:
# 1. Missing GROQ_API_KEY
grep GROQ_API_KEY .env.local

# 2. Port 3005 already in use
lsof -i :3005
# Kill process: kill -9 <PID>

# 3. Build failed
rm -rf .next
bun run build
```

### Issue 2: CORS Errors in Browser

**Symptom**: Browser console shows CORS policy errors

```bash
# Verify CORS middleware is imported
grep -r "corsHeaders" src/app/api/course/

# Should show imports in all route files
```

**Solution**: If missing, the CORS fix didn't deploy properly. Check git status:

```bash
git status
git pull origin main  # Pull latest changes
./deploy.sh          # Redeploy
```

### Issue 3: 502 Bad Gateway from Caddy

**Symptom**: Caddy returns 502 error

```bash
# Check if app is running
pm2 status

# Check Caddy logs
sudo journalctl -u caddy -n 50 -f

# Verify port in Caddyfile matches ecosystem.config.js
grep "PORT" ecosystem.config.js  # Should be 3005
grep "3005" /etc/caddy/Caddyfile  # Should proxy to :3005
```

### Issue 4: "GROQ_API_KEY environment variable is required"

**Symptom**: Application starts but API calls fail

```bash
# Verify .env.local exists and has the key
cat .env.local

# Make sure PM2 picks up the environment
pm2 restart course-builder-ai --update-env

# Check if PM2 sees the environment variable
pm2 env course-builder-ai | grep GROQ
```

### Issue 5: Swagger UI "Load failed" TypeError

This is the main issue we're debugging. Follow this checklist:

#### A. Verify Application Layer

```bash
# 1. Check app is running
pm2 status | grep course-builder-ai

# 2. Test API directly (bypass Caddy)
curl -v -X POST http://localhost:3005/api/course/blueprint \
  -H "Content-Type: application/json" \
  -d @examples/1-blueprint-request-beginner.json

# Expected: 200 OK with JSON response
# If fails: Check application logs
```

#### B. Verify CORS Headers

```bash
# 3. Check CORS headers in response
curl -v -X OPTIONS http://localhost:3005/api/course/blueprint

# Should see:
# < HTTP/1.1 200 OK
# < Access-Control-Allow-Origin: *
# < Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

#### C. Verify Through Caddy

```bash
# 4. Test through Caddy
curl -v -X POST http://localhost:8080/api/course/blueprint \
  -H "Content-Type: application/json" \
  -d @examples/1-blueprint-request-beginner.json

# Check if CORS headers are preserved by Caddy
```

#### D. Check Browser Console

```bash
# 5. Open browser developer tools
# Go to: http://localhost:8080/api-docs
# Open Console (F12)
# Try executing a request
# Look for specific error messages
```

**Common browser errors:**

1. **"TypeError: Load failed"** or **"NetworkError"**
   - Could be CORS issue
   - Could be application not responding
   - Could be wrong URL in Swagger

2. **"CORS policy: No 'Access-Control-Allow-Origin' header"**
   - CORS headers not being sent
   - Check Step B above

3. **"Failed to fetch"**
   - Application not running
   - Wrong port/URL
   - Network issue

#### E. Verify OpenAPI Spec URL

```bash
# Check what URL Swagger is using
grep -A 5 '"servers"' public/openapi.json

# Should show localhost:3000 or your Caddy URL
# NOT the Vercel URL for local testing
```

**If it shows Vercel URL**, temporarily change it:

```bash
# Edit public/openapi.json
nano public/openapi.json

# Change first server to:
# {
#   "url": "http://localhost:3005",
#   "description": "Local development"
# }

# Restart app
pm2 restart course-builder-ai
```

## Monitoring Commands

```bash
# Watch PM2 logs in real-time
pm2 logs course-builder-ai --lines 50

# Watch Caddy logs
sudo journalctl -u caddy -f

# Check application health
curl http://localhost:3005/
curl http://localhost:8080/

# Monitor resource usage
pm2 monit

# Check all PM2 apps
pm2 list
```

## Complete Reset (Nuclear Option)

If nothing works, try a complete reset:

```bash
# 1. Stop and delete PM2 app
pm2 delete course-builder-ai

# 2. Clean build artifacts
cd /home/dev/git/course-builder-ai
rm -rf .next node_modules

# 3. Fresh install
bun install

# 4. Build
bun run build

# 5. Start
pm2 start ecosystem.config.js --env production
pm2 save

# 6. Test
curl http://localhost:3005/
```

## Getting Help

If you're still stuck, gather this information:

```bash
# 1. PM2 status and logs
pm2 status > debug-info.txt
pm2 logs course-builder-ai --lines 100 --nostream >> debug-info.txt

# 2. Caddy status
sudo systemctl status caddy >> debug-info.txt

# 3. Test results
curl -v http://localhost:3005/ >> debug-info.txt 2>&1
curl -v http://localhost:3005/api/course/blueprint >> debug-info.txt 2>&1

# 4. Environment check
cat .env.local | grep -v "gsk_" >> debug-info.txt  # Hides API key

# Share debug-info.txt
cat debug-info.txt
```

## Useful Links

- PM2 Documentation: https://pm2.keymetrics.io/
- Caddy Documentation: https://caddyserver.com/docs/
- Next.js Deployment: https://nextjs.org/docs/deployment
- Project README: /home/dev/git/course-builder-ai/README.md
- CORS Fix Details: /home/dev/git/course-builder-ai/CORS_FIX.md
