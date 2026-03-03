const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = (Chat, Message, User) => {
  const router = express.Router();
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  // Middleware to verify token
  const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      console.error('[v0] Token verification error:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  };

  // Get all chats for current user
  router.get('/', verifyToken, async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.userId);
      
      const chats = await Chat.find({
        $or: [{ user1_id: userId }, { user2_id: userId }],
      }).lean();

      // Get chat details with last messages
      const chatDetails = await Promise.all(
        chats.map(async chat => {
          const otherUserId =
            chat.user1_id.toString() === req.userId
              ? chat.user2_id
              : chat.user1_id;

          const otherUser = await User.findById(otherUserId).select('name email');
          const lastMessage = await Message.findOne({
            chat_id: chat._id,
          })
            .sort({ timestamp: -1 })
            .lean();

          return {
            _id: chat._id,
            user_id: otherUserId,
            name: otherUser?.name || 'Unknown',
            email: otherUser?.email || '',
            last_message: lastMessage?.text || '',
            last_message_time: lastMessage?.timestamp || null,
          };
        })
      );

      res.json({ chats: chatDetails });
    } catch (error) {
      console.error('[v0] Error fetching chats:', error);
      res.status(500).json({ message: 'Error fetching chats' });
    }
  });

  // Get specific chat with messages
  router.get('/:chatId', verifyToken, async (req, res) => {
    try {
      const chat = await Chat.findById(req.params.chatId);

      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      // Verify user is part of this chat
      if (
        chat.user1_id.toString() !== req.userId &&
        chat.user2_id.toString() !== req.userId
      ) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Get other user info
      const otherUserId =
        chat.user1_id.toString() === req.userId
          ? chat.user2_id
          : chat.user1_id;

      const otherUser = await User.findById(otherUserId).select(
        'name email skills_offering skills_learning'
      );

      // Get messages
      const messages = await Message.find({ chat_id: req.params.chatId })
        .sort({ timestamp: 1 })
        .lean();

      res.json({
        chat,
        other_user: otherUser,
        messages,
        current_user_id: req.userId,
      });
    } catch (error) {
      console.error('[v0] Error fetching chat:', error);
      res.status(500).json({ message: 'Error fetching chat' });
    }
  });

  // Create or get chat with another user
  router.post('/init/:userId', verifyToken, async (req, res) => {
    try {
      const user1Id = new mongoose.Types.ObjectId(req.userId);
      const user2Id = new mongoose.Types.ObjectId(req.params.userId);

      // Check if chat already exists
      let chat = await Chat.findOne({
        $or: [
          { user1_id: user1Id, user2_id: user2Id },
          { user1_id: user2Id, user2_id: user1Id },
        ],
      });

      if (!chat) {
        chat = new Chat({
          user1_id: user1Id,
          user2_id: user2Id,
        });
        await chat.save();
      }

      res.json({ chat_id: chat._id });
    } catch (error) {
      console.error('[v0] Error initializing chat:', error);
      res.status(500).json({ message: 'Error initializing chat' });
    }
  });

  return router;
};
