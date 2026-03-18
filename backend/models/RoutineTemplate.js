const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: String
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    primaryMuscle: {
      type: String,
      trim: true
    },
    sets: {
      type: Number
    },
    reps: {
      type: Number
    },
    youtubeLink: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const routineTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    exercises: [exerciseSchema]
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model('RoutineTemplate', routineTemplateSchema);