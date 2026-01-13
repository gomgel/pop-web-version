# Deployment Guide (On-Premise)

This guide walks you through deploying the **pop** application (Next.js Client + Express Server) to a Linux/macOS server using **PM2**.

## Prerequisites

Ensure your server has the following installed:
- **Node.js** (v18 or higher recommended)
- **NPM** (usually comes with Node.js)
- **Git**

## 1. Initial Setup

### Install Process Manager
Install PM2 globally to manage your application processes:
```bash
npm install -g pm2
```

## 1. Transfer Code to Server

Since you are deploying manually, you need to copy your code to the server.

### Option A: Using SCP (Recommended)
This method copies your files directly over SSH.

1.  **On your local machine**, zip the project (excluding `node_modules` to verify fresh install on server):
    ```bash
    # Run this in the project root
    zip -r pop-deploy.zip . -x "**/node_modules/*" "**/.next/*" "**/dist/*" "**/.git/*"
    ```

2.  **Copy the zip to your server**:
    ```bash
    scp pop-deploy.zip user@your-server-ip:/path/to/destination
    ```

3.  **On the server**, unzip the file:
    ```bash
    unzip pop-deploy.zip -d pop
    cd pop
    ```

### Option B: Git (If using GitHub/GitLab)
If you have a git repository:
```bash
git clone <your-repo-url>
cd pop
```

## 2. Build the Application

You need to install dependencies and build both the client and server.

### Client Setup
```bash
cd client
npm install
npm run build
```

### Server Setup
```bash
cd ../server
npm install
npm run build
```

## 3. Start the Application

Return to the root directory and start the apps using the ecosystem file:

```bash
cd ..
pm2 start ecosystem.config.js
```

### Save Process List
To ensure apps restart after a server reboot:
```bash
pm2 save
pm2 startup
```
(Follow the instructions output by the `pm2 startup` command).

## 4. (Optional) Nginx Reverse Proxy

To serve your app on a standard domain (port 80/443), install Nginx and configure it:

**Example Nginx Config (`/etc/nginx/sites-available/pop`):**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (Express)
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
