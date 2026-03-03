require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillswap';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('[v0] Connected to MongoDB'))
  .catch(err => console.error('[v0] MongoDB connection error:', err));

// Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  skills_offering: [String],
  skills_learning: [String],
  created_at: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  user1_id: mongoose.Schema.Types.ObjectId,
  user2_id: mongoose.Schema.Types.ObjectId,
  created_at: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  chat_id: mongoose.Schema.Types.ObjectId,
  sender_id: mongoose.Schema.Types.ObjectId,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Chat = mongoose.model('Chat', chatSchema);
const Message = mongoose.model('Message', messageSchema);

// Routes - Import from separate files
const authRoutes = require('./routes/auth')(User);
const userRoutes = require('./routes/users')(User);
const matchRoutes = require('./routes/matches')(User, Chat);
const chatRoutes = require('./routes/chat')(Chat, Message, User);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', require('./routes/messages')(Message, Chat));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[v0] Error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[v0] SkillSwap backend running on port ${PORT}`);
});
