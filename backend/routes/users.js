const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (User) => {
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

  // Get current user
  router.get('/me', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      res.json({ user });
    } catch (error) {
      console.error('[v0] Error fetching user:', error);
      res.status(500).json({ message: 'Error fetching user' });
    }
  });

  // Update user skills
  router.put('/me/skills', verifyToken, async (req, res) => {
    try {
      const { skills_offering, skills_learning } = req.body;

      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          skills_offering: skills_offering || [],
          skills_learning: skills_learning || [],
        },
        { new: true }
      ).select('-password');

      res.json({ message: 'Skills updated', user });
    } catch (error) {
      console.error('[v0] Error updating skills:', error);
      res.status(500).json({ message: 'Error updating skills' });
    }
  });

  // Get user by ID
  router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      console.error('[v0] Error fetching user:', error);
      res.status(500).json({ message: 'Error fetching user' });
    }
  });

  return router;
};
