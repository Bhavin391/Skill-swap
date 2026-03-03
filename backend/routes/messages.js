const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = (Message, Chat) => {
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

  // Send message
  router.post('/', verifyToken, async (req, res) => {
    try {
      const { chat_id, text } = req.body;

      if (!chat_id || !text) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Verify user is part of this chat
      const chat = await Chat.findById(chat_id);
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      if (
        chat.user1_id.toString() !== req.userId &&
        chat.user2_id.toString() !== req.userId
      ) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Create message
      const message = new Message({
        chat_id: new mongoose.Types.ObjectId(chat_id),
        sender_id: new mongoose.Types.ObjectId(req.userId),
        text,
      });

      await message.save();

      console.log('[v0] Message sent in chat', chat_id);

      res.json({
        message: 'Message sent',
        data: message,
      });
    } catch (error) {
      console.error('[v0] Error sending message:', error);
      res.status(500).json({ message: 'Error sending message' });
    }
  });

  // Get messages for a chat
  router.get('/chat/:chatId', verifyToken, async (req, res) => {
    try {
      const messages = await Message.find({
        chat_id: req.params.chatId,
      })
        .sort({ timestamp: 1 })
        .lean();

      res.json({ messages });
    } catch (error) {
      console.error('[v0] Error fetching messages:', error);
      res.status(500).json({ message: 'Error fetching messages' });
    }
  });

  return router;
};
