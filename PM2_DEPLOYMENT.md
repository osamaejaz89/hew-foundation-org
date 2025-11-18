# PM2 Deployment Guide - HEW Foundation

## 📋 Prerequisites (Pehle Ye Check Karo)

1. **Node.js** installed (version 16+ recommended)
2. **PM2** globally installed
3. **Build** folder (`dist/`) ready

---

## 🚀 Step-by-Step Deployment

### Step 1: Install Dependencies

```bash
# Agar yarn use kar rahe ho
yarn install

# Ya npm use kar rahe ho
npm install
```

### Step 2: Install PM2 Globally (Agar Nahi Hai)

```bash
npm install -g pm2

# Ya yarn se
yarn global add pm2
```

### Step 3: Build Your Application

```bash
# Production build banao
npm run build
# ya
yarn build
```

**Important:** `dist/` folder create hona chahiye build ke baad.

### Step 4: Create Logs Directory

```bash
# PM2 logs ke liye directory banao
mkdir logs
```

### Step 5: Start Application with PM2

```bash
# Method 1: Ecosystem config use karke (Recommended)
npm run pm2:start
# ya
pm2 start ecosystem.config.js

# Method 2: Direct command
pm2 start server.js --name hew-foundation
```

### Step 6: Verify Application is Running

```bash
# Check status
pm2 status

# Check logs
npm run pm2:logs
# ya
pm2 logs hew-foundation

# Real-time monitoring
npm run pm2:monit
# ya
pm2 monit
```

---

## 📝 Available PM2 Commands

### Using NPM Scripts (Easy Way)

```bash
# Start application
npm run pm2:start

# Stop application
npm run pm2:stop

# Restart application
npm run pm2:restart

# Delete from PM2
npm run pm2:delete

# View logs
npm run pm2:logs

# Monitor in real-time
npm run pm2:monit

# Build and deploy (one command)
npm run deploy
```

### Direct PM2 Commands

```bash
# Start
pm2 start ecosystem.config.js

# Stop
pm2 stop hew-foundation

# Restart
pm2 restart hew-foundation

# Delete
pm2 delete hew-foundation

# View logs
pm2 logs hew-foundation

# View last 100 lines
pm2 logs hew-foundation --lines 100

# Clear logs
pm2 flush

# Monitor
pm2 monit

# Save PM2 process list (auto-start on reboot)
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

---

## 🔄 Update/Deploy New Version

### Method 1: Quick Deploy (Recommended)

```bash
npm run deploy
```

Ye command automatically:
1. Build karega (`npm run build`)
2. PM2 restart karega (`pm2 restart hew-foundation`)

### Method 2: Manual Steps

```bash
# 1. Build new version
npm run build

# 2. Restart PM2
npm run pm2:restart
# ya
pm2 restart hew-foundation

# 3. Check logs
npm run pm2:logs
```

---

## 📊 Monitoring & Management

### Check Application Status

```bash
pm2 status
pm2 list
pm2 show hew-foundation
```

### View Logs

```bash
# All logs
pm2 logs hew-foundation

# Only error logs
pm2 logs hew-foundation --err

# Only output logs
pm2 logs hew-foundation --out

# Last 50 lines
pm2 logs hew-foundation --lines 50

# Follow logs (like tail -f)
pm2 logs hew-foundation --lines 0
```

### Real-time Monitoring

```bash
pm2 monit
```

Ye command se aap dekh sakte ho:
- CPU usage
- Memory usage
- Logs in real-time

---

## 🔧 Configuration Details

### Ecosystem Config (`ecosystem.config.js`)

Current settings:
- **App Name:** `hew-foundation`
- **Port:** `4000` (change kar sakte ho via PORT env variable)
- **Instances:** `1` (single instance)
- **Memory Limit:** `1GB` (auto-restart if exceeded)
- **Auto Restart:** `true`
- **Logs Location:** `./logs/` directory

### Change Port

Agar port change karna hai:

```bash
# Method 1: Environment variable
PORT=5000 pm2 start ecosystem.config.js

# Method 2: Edit ecosystem.config.js
# env section mein PORT change karo
```

---

## 🛠️ Troubleshooting

### Application Start Nahi Ho Raha

1. **Check logs:**
   ```bash
   pm2 logs hew-foundation --err
   ```

2. **Check if port already in use:**
   ```bash
   # Windows
   netstat -ano | findstr :4000
   
   # Linux/Mac
   lsof -i :4000
   ```

3. **Check if dist folder exists:**
   ```bash
   ls dist
   # Agar nahi hai, build karo
   npm run build
   ```

### Application Crash Ho Raha Hai

1. **Check error logs:**
   ```bash
   pm2 logs hew-foundation --err
   ```

2. **Check memory:**
   ```bash
   pm2 monit
   ```

3. **Restart manually:**
   ```bash
   pm2 restart hew-foundation
   ```

### PM2 Commands Not Working

1. **Check if PM2 is installed:**
   ```bash
   pm2 --version
   ```

2. **Reinstall PM2:**
   ```bash
   npm install -g pm2
   ```

### Logs Directory Missing

```bash
mkdir logs
pm2 restart hew-foundation
```

---

## 🔐 Production Best Practices

### 1. Save PM2 Process List

```bash
pm2 save
```

Ye command PM2 process list ko save karega, taaki system restart ke baad automatically start ho.

### 2. Setup Auto-Start on Boot

```bash
# Generate startup script
pm2 startup

# Follow the instructions shown
# Then save the process list
pm2 save
```

### 3. Environment Variables

Production mein sensitive data ke liye `.env` file use karo:

```bash
# .env file create karo
NODE_ENV=production
PORT=4000
API_URL=https://api.example.com
```

Aur `ecosystem.config.js` mein add karo:
```javascript
env_file: ".env"
```

### 4. Health Check

Application health check ke liye:

```bash
# Check if app is responding
curl http://localhost:4000

# Check PM2 status
pm2 status
```

---

## 📈 Performance Monitoring

### View Detailed Info

```bash
pm2 show hew-foundation
```

### View Metrics

```bash
pm2 monit
```

### Export Metrics

```bash
pm2 jlist    # JSON format
pm2 prettylist  # Pretty format
```

---

## 🗑️ Complete Removal

Agar PM2 se completely remove karna hai:

```bash
# Stop and delete
pm2 stop hew-foundation
pm2 delete hew-foundation

# Clear all logs
pm2 flush

# Remove from startup (if added)
pm2 unstartup
```

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start | `npm run pm2:start` |
| Stop | `npm run pm2:stop` |
| Restart | `npm run pm2:restart` |
| Deploy | `npm run deploy` |
| Logs | `npm run pm2:logs` |
| Monitor | `npm run pm2:monit` |
| Status | `pm2 status` |

---

## ✅ Deployment Checklist

- [ ] Dependencies installed (`npm install` / `yarn install`)
- [ ] PM2 installed globally
- [ ] Application built (`npm run build`)
- [ ] `dist/` folder exists
- [ ] `logs/` directory created
- [ ] Application started with PM2
- [ ] Status verified (`pm2 status`)
- [ ] Logs checked (no errors)
- [ ] Application accessible on port 4000
- [ ] PM2 process list saved (`pm2 save`)
- [ ] Auto-start configured (optional)

---

## 🎯 Common Workflow

```bash
# 1. Code changes ke baad
git pull

# 2. Dependencies update (if needed)
npm install

# 3. Build
npm run build

# 4. Deploy
npm run deploy

# 5. Verify
pm2 status
pm2 logs hew-foundation --lines 20
```

---

**Note:** Agar koi issue aaye, pehle logs check karo: `pm2 logs hew-foundation`

