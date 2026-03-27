# Starting the Backend - Troubleshooting Guide

## Quick Start (Copy & Paste)

Open **2 separate terminals/PowerShell windows**:

### Terminal 1: Start MongoDB
```bash
# Windows - if you installed MongoDB locally
mongod

# Or check if it's already running as a service:
# Services app → Look for "MongoDB Server"
```

**You should see:**
```
[initandlisten] waiting for connections on port 27017
```

### Terminal 2: Start Backend
```bash
cd backend
npm run dev
```

**You should see:**
```
[v0] Connected to MongoDB
[v0] SkillSwap backend running on http://localhost:5000
```

If you see this, SUCCESS! Your backend is running.

---

## If It's NOT Working - Troubleshoot Step by Step

### Issue 1: Port 5000 Already in Use

**Error Message:**
```
EADDRINUSE: address already in use 0.0.0.0:5000
```

**Fix:**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill it (replace XXXXX with the PID number)
taskkill /PID XXXXX /F

# Or use a different port - edit backend/.env:
# Change PORT=5000 to PORT=5001
# Then update frontend .env.local: NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Issue 2: MongoDB Not Connected

**Error Message:**
```
[v0] Error connecting to MongoDB: ...
```

**Possible Causes & Fixes:**

**A) MongoDB Not Running:**
```powershell
# Check if MongoDB is installed
mongod --version

# If installed, start it:
mongod

# On Windows, it might be a service:
# Windows Key → Services → Look for "MongoDB Server" → Start it
```

**B) Wrong Connection String:**
- Open `backend/.env`
- Check `MONGO_URI` is correct
- If using local MongoDB: `mongodb://localhost:27017/skillswap` ✓
- If using MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority` ✓

**C) Database Permissions:**
```powershell
# Verify MongoDB is listening on port 27017
netstat -ano | findstr :27017

# If nothing shows up, MongoDB isn't running
```

### Issue 3: Cannot Find Dependencies

**Error Message:**
```
Error: Cannot find module 'express'
...
```

**Fix:**
```bash
cd backend
npm install
```

Then try again:
```bash
npm run dev
```

### Issue 4: Node Version Issue

**Error:**
```
npm ERR! node v14.x.x is not supported
```

**Fix:**
```powershell
# Check your Node version
node --version

# You need Node 16 or higher
# Download from https://nodejs.org
```

---

## Complete Restart Procedure (Nuclear Option)

Do this if nothing is working:

```powershell
# 1. Kill all Node processes
taskkill /IM node.exe /F

# 2. Kill MongoDB if needed
taskkill /IM mongod.exe /F

# 3. Clear npm cache
npm cache clean --force

# 4. Navigate to backend
cd backend

# 5. Delete node_modules and reinstall
rmdir /s /q node_modules
npm install

# 6. Make sure .env exists with correct values
# backend/.env should have:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/skillswap
# FRONTEND_URL=http://localhost:3000
# JWT_SECRET=your-secret-key

# 7. Start MongoDB (in one terminal)
mongod

# 8. Start backend (in another terminal)
npm run dev
```

---

## Testing the Backend Directly

Once backend claims to be running, test it:

### Using PowerShell:
```powershell
# Test if backend is responding
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET

# Should return something like:
# StatusCode        : 200
# StatusDescription : OK
```

### Using curl (if installed):
```bash
curl http://localhost:5000/api/health
```

### Using browser:
Just visit: `http://localhost:5000/api/health`

You should see:
```json
{"status":"ok"}
```

---

## Expected Startup Sequence

When you run `npm run dev` in backend folder, you should see:

1. **Nodemon starts:**
   ```
   [nodemon] 2.0.x
   [nodemon] to restart at any time, enter `rs`
   ```

2. **Server starts:**
   ```
   [v0] SkillSwap backend running on http://localhost:5000
   ```

3. **MongoDB connects:**
   ```
   [v0] Connected to MongoDB
   ```

4. **Ready for requests:**
   ```
   [v0] GET /api/health  ← means frontend is talking to you
   ```

---

## Verify Everything is Ready

### Checklist:

- [ ] MongoDB is running (see "waiting for connections on port 27017")
- [ ] Backend terminal shows "[v0] Connected to MongoDB"
- [ ] Backend terminal shows "[v0] SkillSwap backend running on http://localhost:5000"
- [ ] No "EADDRINUSE" or "ECONNREFUSED" errors
- [ ] Browser console NO LONGER shows "Connection failed"

Once all checked, try logging in on frontend. You should see:

```
[v0] API POST http://localhost:5000/api/auth/login
[v0] API Success: 200
```

---

## Still Stuck?

Check these files:

1. **backend/.env** - Has all correct values?
2. **backend/server.js** - Lines 9-14 (CORS config correct)?
3. **MongoDB** - Is it actually running? Check Task Manager
4. **Firewall** - Is anything blocking port 5000?
5. **.env.local** - Does it have `NEXT_PUBLIC_API_URL=http://localhost:5000`?

If still stuck after all this, share the EXACT error message you see in the backend terminal.
