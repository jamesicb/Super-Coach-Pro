// ─── Workout & Exercise ──────────────────────────────────────────────────────

export type WeightUnit = "kg" | "lb" | "bodyweight"

export interface Set {
  id: string
  reps: number
  weight: number
  completed: boolean
}

export interface Exercise {
  id: string
  name: string
  muscleGroup: string
  weightUnit: WeightUnit
  sets: Set[]
  notes?: string
}

export interface Workout {
  id: string
  name: string
  description?: string
  exercises: Exercise[]
  estimatedDuration: number // in minutes
  createdAt: string
  updatedAt: string
}

// ─── Live Session ────────────────────────────────────────────────────────────

export interface LoggedSet {
  setNumber: number
  targetReps: number
  targetWeight: number
  actualReps: number
  actualWeight: number
  skipped: boolean
}

export interface SessionExercise {
  exerciseId: string
  exerciseName: string
  muscleGroup: string
  sets: LoggedSet[]
}

export interface WorkoutSession {
  id: string
  workoutId: string
  workoutName: string
  date: string
  startTime: string
  endTime: string
  elapsedSeconds: number
  exercises: SessionExercise[]
  totalVolume: number // total kg lifted
  notes?: string
}

// ─── Diet & Nutrition ────────────────────────────────────────────────────────

export interface FoodItem {
  id: string
  name: string
  servingSize: string // e.g. "100g", "1 cup"
  calories: number
  protein: number // g
  carbs: number // g
  fat: number // g
  fiber?: number // g
}

export interface Meal {
  id: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  name: string
  items: FoodItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

export interface MealPlan {
  id: string
  name: string
  description?: string
  meals: Meal[]
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFat: number
  createdAt: string
  updatedAt: string
}

// ─── Calendar ────────────────────────────────────────────────────────────────

export type CalendarEventType = "workout" | "meal"

export interface CalendarEvent {
  id: string
  date: string // ISO date string YYYY-MM-DD
  type: CalendarEventType
  title: string
  referenceId: string // workoutId or mealPlanId
  color?: string
}

// ─── AI Chat ─────────────────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant"

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
}

// ─── User / Auth ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl?: string
  fitnessGoal: "lose_weight" | "build_muscle" | "maintain" | "improve_endurance"
  weightKg?: number
  heightCm?: number
}
