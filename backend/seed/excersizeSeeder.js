const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const Exercise = require("../models/Exercise");

const exercises = [
  {
    name: "Bench Press",
    primaryMuscle: "Chest",
    defaultSets: 4,
    defaultReps: 8,
    youtubeLink: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
  },
  {
    name: "Incline Dumbbell Press",
    primaryMuscle: "Chest",
    defaultSets: 3,
    defaultReps: 10,
    youtubeLink: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
  },
  {
    name: "Squat",
    primaryMuscle: "Quads",
    defaultSets: 4,
    defaultReps: 6,
    youtubeLink: "https://www.youtube.com/watch?v=Dy28eq2PjcM",
  },
  {
    name: "Deadlift",
    primaryMuscle: "Back",
    defaultSets: 3,
    defaultReps: 5,
    youtubeLink: "https://www.youtube.com/watch?v=op9kVnSso6Q",
  },
  {
    name: "Pull Ups",
    primaryMuscle: "Back",
    defaultSets: 3,
    defaultReps: 8,
    youtubeLink: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
  },
  {
    name: "Shoulder Press",
    primaryMuscle: "Shoulders",
    defaultSets: 3,
    defaultReps: 10,
    youtubeLink: "https://www.youtube.com/watch?v=B-aVuyhvLHU",
  },
  {
    name: "Lateral Raises",
    primaryMuscle: "Shoulders",
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: "https://www.youtube.com/watch?v=3VcKaXpzqRo",
  },
  {
    name: "Bicep Curl",
    primaryMuscle: "Biceps",
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
  },
  {
    name: "Tricep Pushdown",
    primaryMuscle: "Triceps",
    defaultSets: 3,
    defaultReps: 12,
    youtubeLink: "https://www.youtube.com/watch?v=2-LAMcpzODU",
  },
];

async function seedExercises() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    await Exercise.deleteMany(); // optional reset
    await Exercise.insertMany(exercises);

    console.log("Exercises seeded successfully ✅");
    process.exit();
  } catch (error) {
    console.error("Error seeding exercises:", error);
    process.exit(1);
  }
}

seedExercises();