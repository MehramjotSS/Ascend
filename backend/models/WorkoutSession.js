const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  weight: Number,
  reps: Number
}, { _id: false });

const exerciseSchema = new mongoose.Schema({
  exerciseId: String,
  name: String,
  sets: [setSchema],
  bestSet: {
    weight: Number,
    reps: Number
  }
}, { _id: false });

const workoutSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  routineId: String,
  routineName: String,
  exercises: [exerciseSchema],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);