const express = require('express');

const RoutineTemplate = require('../models/RoutineTemplate');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create routine template
// POST /api/routines
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, exercises } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Routine name is required' });
    }

    const routine = await RoutineTemplate.create({
      userId: req.userId,
      name: name.trim(),
      exercises: Array.isArray(exercises) ? exercises : []
    });

    return res.status(201).json(routine);
  } catch (error) {
    console.error('Create routine error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all routines for current user
// GET /api/routines
router.get('/', authMiddleware, async (req, res) => {
  try {
    const routines = await RoutineTemplate.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json(routines);
  } catch (error) {
    console.error('Get routines error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update routine template
// PUT /api/routines/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, exercises } = req.body;

    const routine = await RoutineTemplate.findOneAndUpdate(
      { _id: id, userId: req.userId },
      {
        ...(name ? { name: name.trim() } : {}),
        ...(exercises ? { exercises } : {})
      },
      { new: true }
    );

    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    return res.json(routine);
  } catch (error) {
    console.error('Update routine error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete routine template
// DELETE /api/routines/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await RoutineTemplate.findOneAndDelete({
      _id: id,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    return res.json({ message: 'Routine deleted' });
  } catch (error) {
    console.error('Delete routine error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

