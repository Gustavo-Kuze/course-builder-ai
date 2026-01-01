#!/bin/bash

# CourseBuilderAI Deployment Script
# This script sets up and deploys the application with PM2 and Caddy

set -e

echo "🚀 CourseBuilderAI Deployment Script"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists and has GROQ_API_KEY
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ Error: .env.local file not found${NC}"
    echo "Please create .env.local and add your GROQ_API_KEY"
    exit 1
fi

if ! grep -q "GROQ_API_KEY=gsk_" .env.local 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Warning: GROQ_API_KEY not set in .env.local${NC}"
    echo "Please add your Groq API key to .env.local"
    echo "Example: GROQ_API_KEY=gsk_your_key_here"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 1: Install dependencies
echo -e "\n${GREEN}📦 Installing dependencies...${NC}"
bun install

# Step 2: Build the application
echo -e "\n${GREEN}🔨 Building application...${NC}"
bun run build

# Step 3: Stop existing PM2 process if running
echo -e "\n${GREEN}🛑 Stopping existing PM2 process...${NC}"
pm2 delete course-builder-ai 2>/dev/null || echo "No existing process to stop"

# Step 4: Start with PM2
echo -e "\n${GREEN}🚀 Starting application with PM2...${NC}"
pm2 start ecosystem.config.js --env production

# Step 5: Save PM2 configuration
echo -e "\n${GREEN}💾 Saving PM2 configuration...${NC}"
pm2 save

# Step 6: Show PM2 status
echo -e "\n${GREEN}📊 PM2 Status:${NC}"
pm2 list

# Step 7: Show logs
echo -e "\n${GREEN}📋 Recent logs:${NC}"
pm2 logs course-builder-ai --lines 20 --nostream

# Step 8: Instructions for Caddy
echo -e "\n${GREEN}✅ Application deployed successfully!${NC}"
echo ""
echo "Next steps:"
echo "==========="
echo "1. Add the Caddy configuration to /etc/caddy/Caddyfile:"
echo "   ${YELLOW}sudo nano /etc/caddy/Caddyfile${NC}"
echo ""
echo "2. Add this block (or use the provided Caddyfile):"
echo "   ${YELLOW}cat Caddyfile${NC}"
echo ""
echo "3. Reload Caddy:"
echo "   ${YELLOW}sudo systemctl reload caddy${NC}"
echo ""
echo "4. Check application status:"
echo "   ${YELLOW}pm2 status${NC}"
echo "   ${YELLOW}pm2 logs course-builder-ai${NC}"
echo ""
echo "Local access: http://localhost:3005"
echo "Via Caddy: http://localhost:8080 (if configured)"
echo ""
