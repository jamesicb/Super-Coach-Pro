export interface ExerciseTemplate {
  id: string
  name: string
  muscleGroup: string
  equipment: string
  description: string
}

export const EXERCISE_LIBRARY: ExerciseTemplate[] = [
  // Chest
  { id: "ex-001", name: "Bench Press", muscleGroup: "Chest", equipment: "Barbell", description: "Compound push movement targeting pectorals." },
  { id: "ex-002", name: "Incline Dumbbell Press", muscleGroup: "Chest", equipment: "Dumbbell", description: "Upper chest focused press on incline bench." },
  { id: "ex-003", name: "Cable Fly", muscleGroup: "Chest", equipment: "Cable", description: "Isolation fly for inner chest." },
  { id: "ex-004", name: "Push-Up", muscleGroup: "Chest", equipment: "Bodyweight", description: "Classic bodyweight chest exercise." },
  { id: "ex-005", name: "Dips", muscleGroup: "Chest", equipment: "Bodyweight", description: "Compound movement for lower chest and triceps." },

  // Back
  { id: "ex-006", name: "Deadlift", muscleGroup: "Back", equipment: "Barbell", description: "King of compound lifts, full posterior chain." },
  { id: "ex-007", name: "Pull-Up", muscleGroup: "Back", equipment: "Bodyweight", description: "Vertical pull for lat development." },
  { id: "ex-008", name: "Barbell Row", muscleGroup: "Back", equipment: "Barbell", description: "Horizontal pull for mid-back thickness." },
  { id: "ex-009", name: "Lat Pulldown", muscleGroup: "Back", equipment: "Cable", description: "Vertical pull targeting the lats." },
  { id: "ex-010", name: "Seated Cable Row", muscleGroup: "Back", equipment: "Cable", description: "Horizontal pull for rhomboids and mid-back." },
  { id: "ex-011", name: "Single Arm Dumbbell Row", muscleGroup: "Back", equipment: "Dumbbell", description: "Unilateral row for balance and thickness." },

  // Legs
  { id: "ex-012", name: "Barbell Squat", muscleGroup: "Legs", equipment: "Barbell", description: "Primary quad and glute compound lift." },
  { id: "ex-013", name: "Romanian Deadlift", muscleGroup: "Legs", equipment: "Barbell", description: "Hip hinge targeting hamstrings and glutes." },
  { id: "ex-014", name: "Leg Press", muscleGroup: "Legs", equipment: "Machine", description: "Quad dominant compound leg press." },
  { id: "ex-015", name: "Walking Lunges", muscleGroup: "Legs", equipment: "Dumbbell", description: "Unilateral leg movement for balance and strength." },
  { id: "ex-016", name: "Leg Curl", muscleGroup: "Legs", equipment: "Machine", description: "Isolation for hamstrings." },
  { id: "ex-017", name: "Calf Raise", muscleGroup: "Legs", equipment: "Machine", description: "Isolation for gastrocnemius and soleus." },
  { id: "ex-018", name: "Bulgarian Split Squat", muscleGroup: "Legs", equipment: "Dumbbell", description: "Advanced unilateral squat for quad hypertrophy." },

  // Shoulders
  { id: "ex-019", name: "Overhead Press", muscleGroup: "Shoulders", equipment: "Barbell", description: "Compound shoulder press targeting deltoids." },
  { id: "ex-020", name: "Dumbbell Lateral Raise", muscleGroup: "Shoulders", equipment: "Dumbbell", description: "Isolation for medial delts." },
  { id: "ex-021", name: "Face Pull", muscleGroup: "Shoulders", equipment: "Cable", description: "Rear delt and external rotation exercise." },
  { id: "ex-022", name: "Arnold Press", muscleGroup: "Shoulders", equipment: "Dumbbell", description: "Rotational dumbbell press for full delt engagement." },

  // Arms
  { id: "ex-023", name: "Barbell Curl", muscleGroup: "Arms", equipment: "Barbell", description: "Classic bicep curl for peak development." },
  { id: "ex-024", name: "Hammer Curl", muscleGroup: "Arms", equipment: "Dumbbell", description: "Neutral grip curl targeting brachialis." },
  { id: "ex-025", name: "Tricep Pushdown", muscleGroup: "Arms", equipment: "Cable", description: "Isolation for tricep lateral head." },
  { id: "ex-026", name: "Skull Crusher", muscleGroup: "Arms", equipment: "Barbell", description: "Lying tricep extension for long head." },
  { id: "ex-027", name: "Preacher Curl", muscleGroup: "Arms", equipment: "Barbell", description: "Strict bicep curl on preacher bench." },

  // Core
  { id: "ex-028", name: "Plank", muscleGroup: "Core", equipment: "Bodyweight", description: "Isometric core stability exercise." },
  { id: "ex-029", name: "Cable Crunch", muscleGroup: "Core", equipment: "Cable", description: "Weighted crunch for rectus abdominis." },
  { id: "ex-030", name: "Hanging Leg Raise", muscleGroup: "Core", equipment: "Bodyweight", description: "Lower ab focused movement." },
  { id: "ex-031", name: "Ab Wheel Rollout", muscleGroup: "Core", equipment: "Equipment", description: "Full core anti-extension exercise." },
]

export const MUSCLE_GROUPS = [...new Set(EXERCISE_LIBRARY.map((e) => e.muscleGroup))].sort()
export const EQUIPMENT_TYPES = [...new Set(EXERCISE_LIBRARY.map((e) => e.equipment))].sort()
