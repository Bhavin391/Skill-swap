# SkillSwap Diagnostic Guide

Having trouble connecting frontend to backend? Follow this diagnostic checklist.

## Quick Check

**Is backend running?**
```bash
# In another terminal, test the backend directly
curl http://localhost:5000/health
```

**Expected response:**
```json
{ "status": "OK" }
```

If you don't see this response, the backend isn't running.

---

## Step-by-Step Diagnostic

### 1. Backend Port Check

**Is port 5000 free?**

```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

**If something is using it:**
- Kill the process:
  ```bash
  # Windows
  taskkill /PID <PID> /F

  # Mac/Linux
  kill -9 <PID>
  ```

### 2. MongoDB Connection Check

**Can backend connect to MongoDB?**

Look for this in backend terminal:
```
[v0] Connected to MongoDB
```

**If you see an error instead:**

**Local MongoDB:**
```bash
# Check if MongoDB is running
# Windows - Check Services app or run:
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**MongoDB Atlas (Cloud):**
- Verify connection string in `backend/.env`
- Format: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`
- Check username & password are correct
- Add your IP to Network Access in MongoDB Atlas dashboard

### 3. Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend (backend/.env):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017
DB_NAME=skillswap
FRONTEND_URL=http://localhost:3000
JWT_SECRET=dev_secret_key
```

### 4. Backend Startup Check

**Full backend startup sequence should look like:**

```
[v0] Connected to MongoDB
[v0] SkillSwap backend running on http://localhost:5000
[v0] Frontend should connect to http://localhost:5000/api
```

### 5. Frontend API Calls

**Open browser console (F12) and watch for:**

When you try to login, you should see:
```
[v0] API POST http://localhost:5000/api/auth/login
[v0] API Success: 200
```

**If you see error instead:**
```
[v0] Connection failed - Is backend running on http://localhost:5000?
```

This means the frontend can't reach the backend.

### 6. CORS Issues

**If you see in console:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Fix:**
1. Ensure backend has CORS configured (it does by default)
2. Verify `FRONTEND_URL` in `backend/.env` matches your frontend URL
3. For local development, it should be: `http://localhost:3000`

### 7. Complete Restart

If nothing works, do a complete restart:

```bash
# Kill all Node processes
# Windows:
taskkill /F /IM node.exe

# Mac/Linux:
killall node

# Kill all port usage
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000 | awk 'NR!=1 {print $2}' | xargs kill -9
lsof -i :3000 | awk 'NR!=1 {print $2}' | xargs kill -9
```

Then restart everything:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

---

## Testing API Endpoints

Once backend is running, test these endpoints:

**Health Check:**
```bash
curl http://localhost:5000/health
# Expected: { "status": "OK" }
```

**Root Endpoint:**
```bash
curl http://localhost:5000/
# Expected: { "message": "SkillSwap API - Backend running", "status": "OK" }
```

**Signup (creates user):**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## Debug Checklist

- [ ] Port 5000 is available (`netstat -ano | findstr :5000` returns nothing)
- [ ] Backend starts without errors (`[v0] Connected to MongoDB`)
- [ ] Backend health check works (`curl http://localhost:5000/health`)
- [ ] MongoDB is running (check for connection in backend logs)
- [ ] `NEXT_PUBLIC_API_URL=http://localhost:5000` in frontend `.env.local`
- [ ] `FRONTEND_URL=http://localhost:3000` in `backend/.env`
- [ ] Frontend console shows `[v0] API POST http://localhost:5000/api/auth/login`
- [ ] No CORS errors in browser console
- [ ] Both servers running (backend on 5000, frontend on 3000)

---

## Common Issues & Solutions

### "EADDRINUSE: address already in use :5000"
Kill the process on port 5000 (see Port Check above)

### "MongoDB connection error"
- Check MongoDB is running
- Verify `MONGO_URI` in `backend/.env`
- For local: `mongodb://localhost:27017`
- For Atlas: Check username, password, IP whitelist

### "API timeout - Backend server not responding"
- Backend isn't running or crashed
- Check backend terminal for errors
- Verify port 5000 is correct in `.env`

### "Connection failed - Is backend running?"
- Backend not running
- Wrong port number
- Firewall blocking port 5000
- CORS issue with headers

### "Failed to login / Invalid credentials"
- User doesn't exist (sign up first)
- Wrong email/password
- Clear browser storage and try again (F12 → Application → Clear All)

### "No matches showing"
- Need at least 2 users with complementary skills
- Sign up twice with different accounts
- Add different skills to each account
- Check backend logs for matching algorithm

---

## Terminal Output Guide

### ✅ Good Backend Startup

```
PS C:\...\backend> npm run dev
[v0] Connected to MongoDB
[v0] SkillSwap backend running on http://localhost:5000
[v0] Frontend should connect to http://localhost:5000/api
[v0] GET /
[v0] GET /health
```

### ❌ Bad Backend Startup - Port in use

```
Error: listen EADDRINUSE: address already in use 0.0.0.0:5000
```
**Solution:** Kill process on port 5000

### ❌ Bad Backend Startup - MongoDB error

```
[v0] MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB

### ❌ Bad Frontend API Call

```
[v0] API POST http://localhost:5000/api/auth/login
[v0] Connection failed - Is backend running on http://localhost:5000?
```
**Solution:** Start backend server

---

## Need More Help?

1. Check browser console (F12) for exact error messages
2. Check backend terminal for server logs
3. Try complete restart (see section above)
4. Verify environment variables are set correctly
5. Test API endpoints directly with curl (examples above)

If still stuck, share:
- Error message from browser console
- Error message from backend terminal
- Output of `netstat -ano | findstr :5000` or `lsof -i :5000`
- Your `.env` files (without passwords)
