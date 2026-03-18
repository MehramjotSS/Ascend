const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Exercise = require('./models/Exercise');

dotenv.config({ path: path.join(__dirname, '.env') });

const exercises = [
  // Chest
  {
    name: 'Bench Press',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    defaultSets: 4,
    defaultReps: 8,
    youtubeLink: 'https://www.youtube.com/watch?v=rT7DgCr-3pg'
  },
  {
    name: 'Incline Dumbbell Press',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    defaultSets: 3,
    defaultReps: 10,
    youtubeLink: 'https://www.youtube.com/watch?v=8iPEnn-ltC8'
  },
  {
    name: 'Cable Flys',
    primaryMuscle: 'Chest',
    secondaryMuscles: [],
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: 'https://www.youtube.com/watch?v=Iwe6AmxVf7o'
  },
  {
    name: 'Push Ups',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    defaultSets: 3,
    defaultReps: 15,
    youtubeLink: 'https://www.youtube.com/watch?v=IODxDxX7oi4'
  },
  
  // Back
  {
    name: 'Deadlift',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Hamstrings', 'Glutes', 'Core'],
    defaultSets: 4,
    defaultReps: 6,
    youtubeLink: 'https://www.youtube.com/watch?v=op9kVnSso6Q'
  },
  {
    name: 'Pull Ups',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps'],
    defaultSets: 4,
    defaultReps: 8,
    youtubeLink: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
  },
  {
    name: 'Barbell Rows',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps'],
    defaultSets: 4,
    defaultReps: 10,
    youtubeLink: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ'
  },
  {
    name: 'Lat Pulldown',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps'],
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: 'https://www.youtube.com/watch?v=CAwf7n6Luuc'
  },
  {
    name: 'Seated Cable Rows',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps'],
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: 'https://www.youtube.com/watch?v=xQNrFHEMhI4'
  },
  
  // Shoulders
  {
    name: 'Overhead Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: ['Triceps'],
    defaultSets: 4,
    defaultReps: 8,
    youtubeLink: 'https://www.youtube.com/watch?v=2yjwXTZQDDI'
  },
  {
    name: 'Lateral Raises',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: [],
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: 'https://www.youtube.com/watch?v=3VcKaXpzqRo'
  },
  {
    name: 'Face Pulls',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: ['Back'],
    defaultSets: 3,
    defaultReps: 15,
    youtubeLink: 'https://www.youtube.com/watch?v=rep-qVOkqgk'
  },
  
  // Legs
  {
    name: 'Squat',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Glutes', 'Core'],
    defaultSets: 4,
    defaultReps: 8,
    youtubeLink: 'https://www.youtube.com/watch?v=ultWZbUMPL8'
  },
  {
    name: 'Leg Press',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Glutes'],
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ'
  },
  {
    name: 'Romanian Deadlift',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Hamstrings', 'Glutes', 'Back'],
    defaultSets: 3,
    defaultReps: 10,
    youtubeLink: 'https://www.youtube.com/watch?v=SHsUIZiNdeY'
  },
  {
    name: 'Leg Curls',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Hamstrings'],
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs'
  },
  {
    name: 'Leg Extensions',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Quadriceps'],
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: 'https://www.youtube.com/watch?v=YyvSfVjQeL0'
  },
  {
    name: 'Calf Raises',
    primaryMuscle: 'Legs',
    secondaryMuscles: ['Calves'],
    defaultSets: 4,
    defaultReps: 15,
    youtubeLink: 'https://www.youtube.com/watch?v=gwLzBJYoWlI'
  },
  
  // Arms - Biceps
  {
    name: 'Barbell Curls',
    primaryMuscle: 'Biceps',
    secondaryMuscles: [],
    defaultSets: 3,
    defaultReps: 10,
    youtubeLink: 'https://www.youtube.com/watch?v=kwG2ipFRgfo'
  },
  {
    name: 'Hammer Curls',
    primaryMuscle: 'Biceps',
    secondaryMuscles: ['Forearms'],
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: 'https://www.youtube.com/watch?v=zC3nLlEvin4'
  },
  {
    name: 'Preacher Curls',
    primaryMuscle: 'Biceps',
    secondaryMuscles: [],
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: 'https://www.youtube.com/watch?v=fIWP-FRFNU0'
  },
  
  // Arms - Triceps
  {
    name: 'Tricep Dips',
    primaryMuscle: 'Triceps',
    secondaryMuscles: ['Chest', 'Shoulders'],
    defaultSets: 3,
    defaultReps: 10,
    youtubeLink: 'https://www.youtube.com/watch?v=0326dy_-CzM'
  },
  {
    name: 'Skull Crushers',
    primaryMuscle: 'Triceps',
    secondaryMuscles: [],
    defaultSets: 3,
    defaultReps: 10,
    youtubeLink: 'https://www.youtube.com/watch?v=d_KZxkY_0cM'
  },
  {
    name: 'Cable Tricep Pushdown',
    primaryMuscle: 'Triceps',
    secondaryMuscles: [],
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: 'https://www.youtube.com/watch?v=2-LAMcpzODU'
  },
  
  // Core
  {
    name: 'Plank',
    primaryMuscle: 'Core',
    secondaryMuscles: [],
    defaultSets: 3,
    defaultReps: 60,
    youtubeLink: 'https://www.youtube.com/watch?v=ASdvN_XEl_c'
  },
  {
    name: 'Ab Wheel Rollout',
    primaryMuscle: 'Core',
    secondaryMuscles: [],
    defaultSets: 3,
    defaultReps: 10,
    youtubeLink: 'https://www.youtube.com/watch?v=EpzW8HmrB7A'
  },
  {
    name: 'Hanging Leg Raises',
    primaryMuscle: 'Core',
    secondaryMuscles: [],
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: 'https://www.youtube.com/watch?v=Pr1ieGZ5atk'
  }
];

async function seedExercises() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log('Cleared existing exercises');

    // Insert seed data
    await Exercise.insertMany(exercises);
    console.log(`Successfully seeded ${exercises.length} exercises`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding exercises:', error);
    process.exit(1);
  }
}

seedExercises();
