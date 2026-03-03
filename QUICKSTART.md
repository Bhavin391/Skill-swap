# SkillSwap - Quick Start Guide

Get SkillSwap running in 5 minutes!

## Prerequisites
- Node.js 16+
- MongoDB running locally OR MongoDB Atlas account

## 1. Start MongoDB (if using local)

```bash
# Mac/Linux
mongod

# Or if installed via Homebrew:
brew services start mongodb-community
```

## 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend will be running on `http://localhost:5000`

## 3. Setup Frontend (New Terminal)

```bash
# From project root
npm install
npm run dev
```

Frontend will be running on `http://localhost:3000`

## 4. Test the App

1. Open http://localhost:3000
2. Click "Get Started" and create an account
3. Add skills you can teach and want to learn
4. Go to "Matches" to find peers
5. Click "Send Message" to start chatting

## Minimal MongoDB Setup

If you don't have MongoDB installed locally, use MongoDB Atlas:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get your connection string
4. Update `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/skillswap
   ```

## File Structure

```
project/
├── app/                          # Next.js frontend
│   ├── page.tsx                 # Landing page
│   ├── signup/                  # Signup form
│   ├── login/                   # Login form
│   ├── dashboard/               # Skills management
│   ├── matches/                 # Find peers
│   ├── chat/                    # Messaging
│   └── profile/                 # User profile
├── backend/                     # Express API
│   ├── routes/
│   │   ├── auth.js             # Authentication
│   │   ├── users.js            # User management
│   │   ├── matches.js          # Skill matching
│   │   ├── chat.js             # Chat management
│   │   └── messages.js         # Messages
│   ├── server.js               # Express setup
│   ├── package.json
│   └── .env.example
├── components/                  # Shadcn UI components
├── SETUP.md                     # Detailed setup guide
└── QUICKSTART.md               # This file
```

## Key Features

✓ User Authentication (Signup/Login)
✓ Skill Profile Management
✓ Peer Matching Algorithm
✓ Real-time Messaging
✓ Modern UI with Tailwind CSS
✓ MongoDB Database
✓ JWT Authentication
✓ Responsive Design

## Matching Algorithm

The app finds peers based on:
- Skills you want to learn that they offer
- Skills you offer that they want to learn

Match Score = (complementary skills) / (total skills) × 100%

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/matches` | Get skill matches |
| GET | `/api/chats` | Get conversations |
| GET | `/api/chats/:id` | Get chat messages |
| POST | `/api/messages` | Send message |

## Troubleshooting

**Port 5000 already in use:**
```bash
lsof -ti:5000 | xargs kill -9
```

**Port 3000 already in use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**MongoDB connection error:**
- Check MongoDB is running
- Verify `MONGO_URI` in `backend/.env`

**Token errors:**
- Clear browser storage: DevTools → Application → Clear All
- Login again

## Next Steps

1. Deploy frontend to Vercel
2. Deploy backend to Railway/Render
3. Use MongoDB Atlas for production
4. Add email notifications
5. Implement user ratings
6. Add video calling

## Useful Resources

- [Next.js Docs](https://nextjs.org)
- [Express Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)

Need more details? See `SETUP.md` for comprehensive guide.

Happy learning! 🎓
