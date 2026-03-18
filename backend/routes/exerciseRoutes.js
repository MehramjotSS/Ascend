const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const protect = require('../middleware/authMiddleware');

// GET /api/exercises - Get all exercises or search by name
router.get('/', protect, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      // Case-insensitive search on name
      query.name = { $regex: search, $options: 'i' };
    }

    const exercises = await Exercise.find(query).sort({ name: 1 });
    res.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/exercises/:id - Get single exercise
router.get('/:id', protect, async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/exercises - Create new exercise (admin/seeding only)
router.post('/', protect, async (req, res) => {
  try {
    const { name, primaryMuscle, defaultSets, defaultReps, youtubeLink } = req.body;

    if (!name || !primaryMuscle) {
      return res.status(400).json({ message: 'Name and primary muscle are required' });
    }

    const exercise = new Exercise({
      name,
      primaryMuscle,
      defaultSets: defaultSets || 3,
      defaultReps: defaultReps || 10,
      youtubeLink: youtubeLink || ''
    });

    await exercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Exercise with this name already exists' });
    }
    console.error('Error creating exercise:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
