import type { WorkoutSession } from "@/types"

export const MOCK_SESSIONS: WorkoutSession[] = [
  {
    id: "sess-001",
    workoutId: "w-001",
    workoutName: "Push Day — Chest & Shoulders",
    date: "2026-03-20",
    startTime: "2026-03-20T07:00:00Z",
    endTime: "2026-03-20T08:05:00Z",
    elapsedSeconds: 3900,
    totalVolume: 6240,
    exercises: [
      {
        exerciseId: "we-001",
        exerciseName: "Bench Press",
        muscleGroup: "Chest",
        sets: [
          { setNumber: 1, targetReps: 5, targetWeight: 100, actualReps: 5, actualWeight: 100, skipped: false },
          { setNumber: 2, targetReps: 5, targetWeight: 100, actualReps: 5, actualWeight: 100, skipped: false },
          { setNumber: 3, targetReps: 5, targetWeight: 100, actualReps: 4, actualWeight: 100, skipped: false },
          { setNumber: 4, targetReps: 5, targetWeight: 100, actualReps: 4, actualWeight: 100, skipped: false },
        ],
      },
      {
        exerciseId: "we-002",
        exerciseName: "Incline Dumbbell Press",
        muscleGroup: "Chest",
        sets: [
          { setNumber: 1, targetReps: 10, targetWeight: 32, actualReps: 10, actualWeight: 32, skipped: false },
          { setNumber: 2, targetReps: 10, targetWeight: 32, actualReps: 10, actualWeight: 32, skipped: false },
          { setNumber: 3, targetReps: 10, targetWeight: 32, actualReps: 9, actualWeight: 32, skipped: false },
        ],
      },
    ],
  },
  {
    id: "sess-002",
    workoutId: "w-002",
    workoutName: "Pull Day — Back & Biceps",
    date: "2026-03-18",
    startTime: "2026-03-18T07:00:00Z",
    endTime: "2026-03-18T08:10:00Z",
    elapsedSeconds: 4200,
    totalVolume: 8320,
    exercises: [
      {
        exerciseId: "we-010",
        exerciseName: "Deadlift",
        muscleGroup: "Back",
        sets: [
          { setNumber: 1, targetReps: 3, targetWeight: 160, actualReps: 3, actualWeight: 160, skipped: false },
          { setNumber: 2, targetReps: 3, targetWeight: 160, actualReps: 3, actualWeight: 160, skipped: false },
          { setNumber: 3, targetReps: 3, targetWeight: 160, actualReps: 3, actualWeight: 162.5, skipped: false },
        ],
      },
    ],
  },
  {
    id: "sess-003",
    workoutId: "w-003",
    workoutName: "Leg Day — Quads & Hamstrings",
    date: "2026-03-16",
    startTime: "2026-03-16T07:00:00Z",
    endTime: "2026-03-16T08:15:00Z",
    elapsedSeconds: 4500,
    totalVolume: 10400,
    exercises: [
      {
        exerciseId: "we-020",
        exerciseName: "Barbell Squat",
        muscleGroup: "Legs",
        sets: [
          { setNumber: 1, targetReps: 5, targetWeight: 120, actualReps: 5, actualWeight: 120, skipped: false },
          { setNumber: 2, targetReps: 5, targetWeight: 120, actualReps: 5, actualWeight: 120, skipped: false },
          { setNumber: 3, targetReps: 5, targetWeight: 120, actualReps: 5, actualWeight: 120, skipped: false },
          { setNumber: 4, targetReps: 5, targetWeight: 120, actualReps: 4, actualWeight: 120, skipped: false },
        ],
      },
    ],
  },
]
