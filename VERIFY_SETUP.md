# Setup Verification Checklist

Complete this checklist to ensure everything is properly configured.

## Before Starting

- [ ] You have Node.js 16+ installed
- [ ] You have MongoDB installed OR MongoDB Atlas account
- [ ] Port 5000 and 3000 are available (nothing else using them)

---

## Step 1: Check Backend Configuration

### 1.1 Backend .env File

Open `backend/.env` and verify these values exist:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillswap
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key-change-this-in-production
```

- [ ] `backend/.env` exists
- [ ] `PORT=5000` is set
- [ ] `MONGO_URI` points to MongoDB (local or Atlas)
- [ ] `FRONTEND_URL=http://localhost:3000`
- [ ] `JWT_SECRET` is set to something

### 1.2 Backend Dependencies

```bash
cd backend
npm install
```

- [ ] `npm install` completed without errors
- [ ] `node_modules` folder created in backend/

---

## Step 2: Check Frontend Configuration

### 2.1 Frontend .env.local

Open `.env.local` in root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

- [ ] `.env.local` exists
- [ ] `NEXT_PUBLIC_API_URL=http://localhost:5000`

### 2.2 Frontend Dependencies

```bash
# From root directory (NOT backend folder)
npm install
```

- [ ] `npm install` completed without errors
- [ ] `node_modules` folder created in root

---

## Step 3: Verify MongoDB Setup

Choose ONE:

### Option A: Local MongoDB

```bash
mongod
```

You should see:
```
waiting for connections on port 27017
```

- [ ] MongoDB is installed
- [ ] MongoDB started successfully
- [ ] See "waiting for connections on port 27017"

### Option B: MongoDB Atlas (Cloud)

- [ ] Account created at mongodb.com/cloud/atlas
- [ ] Cluster created
- [ ] Connection string copied
- [ ] `backend/.env` MONGO_URI updated with your connection string
- [ ] Your IP added to Network Access (Security → Network Access)

---

## Step 4: Start Backend

In Terminal/PowerShell, navigate to backend folder:

```bash
cd backend
npm run dev
```

Watch for these messages in order:

1. **Nodemon starts:**
   ```
   [nodemon] x.x.x
   [nodemon] app crashed - waiting for file changes before starting...
   ```
   (Don't worry if this appears first)

2. **MongoDB connects:**
   ```
   [v0] Connected to MongoDB
   ```

3. **Server starts:**
   ```
   [v0] SkillSwap backend running on http://localhost:5000
   ```

Once you see all three, backend is ready!

- [ ] Nodemon started
- [ ] MongoDB connected message appears
- [ ] Backend running on port 5000 message appears
- [ ] No EADDRINUSE errors
- [ ] No ECONNREFUSED errors

---

## Step 5: Start Frontend

**Open a NEW terminal window** (keep backend running in first terminal)

From root directory (NOT backend folder):

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.1.6
  - Local:        http://localhost:3000
```

- [ ] Frontend started
- [ ] See "Local: http://localhost:3000"

---

## Step 6: Test in Browser

1. Open browser: http://localhost:3000
2. Click "Start Free Today" or go to /signup
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. Click Submit

### Check browser console (F12):

You should see:
```
[v0] API POST http://localhost:5000/api/auth/signup
[v0] API Success: 200
```

**NOT:**
```
[v0] API Request Error: ...
Connection failed - Is backend running on http://localhost:5000?
```

- [ ] Signup form opens
- [ ] Can fill in form
- [ ] Click submit without JavaScript errors
- [ ] Browser console shows "[v0] API Success: 200"
- [ ] Redirected to dashboard after signup

---

## Step 7: Test Authentication

After signup, you should be on Dashboard:

1. Add a skill in "Can Teach" field
2. Add a skill in "Want to Learn" field
3. Click "Save Skills & Find Matches"

Check browser console for:
```
[v0] API PUT http://localhost:5000/api/users/me/skills
[v0] API Success: 200
```

- [ ] Can add skills
- [ ] Can save skills
- [ ] Browser console shows success
- [ ] Skills are persisted

---

## Step 8: Test Matching

1. Create a second account (different email)
2. Add different skills
3. Go to Matches page on both accounts

You should see users with complementary skills.

- [ ] Second account created
- [ ] Can access Matches page
- [ ] See other users (if 2+ accounts with skills exist)

---

## Step 9: Test Messaging

1. On first account, go to Matches
2. Click "Connect & Learn" on another user
3. Go to Messages page
4. Click a conversation
5. Type a message and send

Browser console should show:
```
[v0] API POST http://localhost:5000/api/messages
[v0] API Success: 200
```

- [ ] Can send message
- [ ] Browser console shows success
- [ ] Message appears in chat

---

## Final Checklist

When ALL items are checked:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected
- [ ] Can signup
- [ ] Can add skills
- [ ] Can see matches
- [ ] Can send messages
- [ ] Browser console shows no "Failed to fetch" errors
- [ ] Browser console shows "[v0] API Success" messages

**You're ready to go!** 🎉

---

## Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| "Port 5000 already in use" | Kill process: `taskkill /PID xxx /F` |
| "Cannot connect to MongoDB" | Start MongoDB: `mongod` |
| "Cannot find module 'express'" | Run `npm install` in backend folder |
| "API Success 200 but nothing happens" | Clear browser cache: F12 → Application → Clear All |
| "Frontend not starting" | Clear `.next` folder: `rmdir /s /q .next` then `npm run dev` |

---

## Need Help?

1. Check the backend terminal for exact error message
2. Check browser console (F12) for API errors
3. Read `START_BACKEND.md` for detailed troubleshooting
4. Read `DIAGNOSTIC.md` for deep debugging

Share the EXACT error message you see, and we can fix it!
