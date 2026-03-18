const express = require('express');
const router = express.Router();
const WorkoutSession = require('../models/WorkoutSession');
const authMiddleware = require('../middleware/authMiddleware');

// Helper: best set logic
function getBestSet(sets) {
  let best = { weight: 0, reps: 0 };

  for (let s of sets) {
    if (
      s.weight > best.weight ||
      (s.weight === best.weight && s.reps > best.reps)
    ) {
      best = s;
    }
  }

  return best;
}

// GET: Fetch all workouts for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const workouts = await WorkoutSession.find({
      userId: req.userId
    }).sort({ date: -1 });

    res.json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching workouts' });
  }
});

// POST: Save workout
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { exercises, routineId, routineName } = req.body;

    const processedExercises = exercises.map(ex => ({
      ...ex,
      bestSet: getBestSet(ex.sets)
    }));

    const workout = await WorkoutSession.create({
      userId: req.userId,
      routineId,
      routineName,
      exercises: processedExercises,
      date: new Date()
    });

    res.json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving workout' });
  }
});

module.exports = router;