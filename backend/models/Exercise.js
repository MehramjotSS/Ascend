const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    primaryMuscle: {
      type: String,
      required: true,
      trim: true
    },
    defaultSets: {
      type: Number,
      default: 3
    },
    defaultReps: {
      type: Number,
      default: 10
    },
    youtubeLink: {
      type: String,
      trim: true,
      default: ''
    },
    createdBy: {
      type: String,
      default: 'system' // future-proofing
    }
  },
  {
    timestamps: true
  }
);

// Search index
exerciseSchema.index({ name: 'text' });

module.exports = mongoose.model('Exercise', exerciseSchema);