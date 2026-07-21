#!/bin/bash

# Sellphone.ae VPS Deployment Script
# Run this on your VPS as root (sudo su)

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting VPS Setup for beta.sellyourphone24.com..."

# 1. Update system and install dependencies
echo "Updating package lists and installing dependencies..."
apt-get update -y
apt-get install -y curl git nginx ufw certbot python3-certbot-nginx

# 2. Install Node.js (v20 LTS recommended)
if ! command -v node &> /dev/null
then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js is already installed."
fi

# 3. Install PM2
if ! command -v pm2 &> /dev/null
then
    echo "Installing PM2..."
    npm install -g pm2
else
    echo "PM2 is already installed."
fi

# 4. Clone or update the repository
REPO_URL="https://github.com/ShaunsCuriosityLearnings/sellphone24completed.git"
DEST_DIR="/var/www/sellphone.ae"

if [ -d "$DEST_DIR" ]; then
    echo "Directory $DEST_DIR exists. Pulling latest changes..."
    cd $DEST_DIR
    git pull origin main # or whatever your default branch is
else
    echo "Cloning repository..."
    git clone $REPO_URL $DEST_DIR
    cd $DEST_DIR
fi

# 5. Set up Backend
echo "Setting up backend..."
cd $DEST_DIR/backend
npm install --legacy-peer-deps

# Wait for user to create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Please create $DEST_DIR/backend/.env with your production variables!"
    echo "Example variables needed:"
    echo "PORT=5000"
    echo "MONGODB_CONNECTION=..."
    echo "CLERK_SECRET_KEY=..."
    echo "CLOUDINARY_CLOUD_NAME=..."
    echo "CLOUDINARY_API_KEY=..."
    echo "CLOUDINARY_API_SECRET=..."
    read -p "Press enter to continue once you have created the .env file..."
fi

pm2 start server.js --name "sellphone-backend" || pm2 restart "sellphone-backend"
pm2 save

# 6. Set up Frontend
echo "Setting up frontend..."
cd $DEST_DIR/sellyouphone24
npm install --legacy-peer-deps

if [ ! -f .env.local ]; then
    echo "Please create $DEST_DIR/sellyouphone24/.env.local with your production variables!"
    echo "Example variables needed:"
    echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=..."
    echo "CLERK_SECRET_KEY=..."
    echo "NEXT_PUBLIC_API_URL=https://beta.sellyourphone24.com/api"
    read -p "Press enter to continue once you have created the .env.local file..."
fi

npm run build
pm2 start npm --name "sellphone-frontend" -- start || pm2 restart "sellphone-frontend"
pm2 save

# PM2 Startup Script
pm2 startup | tail -n 1 | bash

echo "Application processes started successfully with PM2."

# 7. Configure Nginx
echo "Configuring Nginx..."
cp $DEST_DIR/vps-setup/nginx.conf /etc/nginx/sites-available/sellphone.ae
ln -sf /etc/nginx/sites-available/sellphone.ae /etc/nginx/sites-enabled/

# Remove default nginx config if exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config and restart
nginx -t
systemctl restart nginx

# 8. Setup SSL with Let's Encrypt
echo "Setting up SSL for beta.sellyourphone24.com..."
echo "Ensure your DNS A record points beta.sellyourphone24.com to this server's IP address."
certbot --nginx -d beta.sellyourphone24.com --non-interactive --agree-tos -m admin@sellyourphone24.com || echo "Certbot skipped. Run 'certbot --nginx -d beta.sellyourphone24.com' manually when DNS is ready."

echo "Deployment Complete! Visit https://beta.sellyourphone24.com"
