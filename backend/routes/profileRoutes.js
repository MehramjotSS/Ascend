const express = require('express');

const Profile = require('../models/Profile');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/profile
// Create or update the current user's profile (upsert)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { height, weight, experienceLevel } = req.body;

    const numericHeight = Number(height);
    const numericWeight = Number(weight);

    if (!Number.isFinite(numericHeight) || !Number.isFinite(numericWeight)) {
      return res.status(400).json({ message: 'Height and weight must be numbers' });
    }

    const allowedLevels = ['beginner', 'intermediate', 'advanced'];
    if (!allowedLevels.includes(experienceLevel)) {
      return res.status(400).json({ message: 'Invalid experience level' });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        userId: req.userId,
        height: numericHeight,
        weight: numericWeight,
        experienceLevel
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return res.json(profile);
  } catch (error) {
    console.error('Profile upsert error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/profile/me
// Get the current user's profile if it exists
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

