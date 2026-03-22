import { create } from "zustand"
import type { Workout, Exercise, Set } from "@/types"
import { MOCK_WORKOUTS } from "@/mock/workouts"

let idCounter = 1000

function genId(prefix: string) {
  return `${prefix}-${Date.now()}-${++idCounter}`
}

function makeDefaultSets(count: number = 3): Set[] {
  return Array.from({ length: count }, () => ({
    id: genId("s"),
    reps: 10,
    weight: 0,
    completed: false,
  }))
}

interface WorkoutState {
  workouts: Workout[]

  addWorkout: (workout: Omit<Workout, "id" | "createdAt" | "updatedAt">) => Workout
  updateWorkout: (id: string, changes: Partial<Omit<Workout, "id" | "createdAt">>) => void
  deleteWorkout: (id: string) => void

  addExerciseToWorkout: (workoutId: string, exercise: Omit<Exercise, "id" | "sets">) => void
  updateExercise: (workoutId: string, exerciseId: string, changes: Partial<Omit<Exercise, "id">>) => void
  removeExerciseFromWorkout: (workoutId: string, exerciseId: string) => void
  reorderExercises: (workoutId: string, exerciseIds: string[]) => void

  updateSet: (workoutId: string, exerciseId: string, setId: string, changes: Partial<Set>) => void
  addSet: (workoutId: string, exerciseId: string) => void
  removeSet: (workoutId: string, exerciseId: string, setId: string) => void
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: MOCK_WORKOUTS,

  addWorkout: (data) => {
    const workout: Workout = {
      ...data,
      id: genId("w"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set((state) => ({ workouts: [...state.workouts, workout] }))
    return workout
  },

  updateWorkout: (id, changes) => {
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id === id ? { ...w, ...changes, updatedAt: new Date().toISOString() } : w,
      ),
    }))
  },

  deleteWorkout: (id) => {
    set((state) => ({ workouts: state.workouts.filter((w) => w.id !== id) }))
  },

  addExerciseToWorkout: (workoutId, exerciseData) => {
    const exercise: Exercise = {
      ...exerciseData,
      id: genId("we"),
      sets: makeDefaultSets(3),
    }
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id === workoutId
          ? { ...w, exercises: [...w.exercises, exercise], updatedAt: new Date().toISOString() }
          : w,
      ),
    }))
  },

  updateExercise: (workoutId, exerciseId, changes) => {
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id !== workoutId
          ? w
          : {
              ...w,
              exercises: w.exercises.map((e) => (e.id === exerciseId ? { ...e, ...changes } : e)),
              updatedAt: new Date().toISOString(),
            },
      ),
    }))
  },

  removeExerciseFromWorkout: (workoutId, exerciseId) => {
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id === workoutId
          ? { ...w, exercises: w.exercises.filter((e) => e.id !== exerciseId), updatedAt: new Date().toISOString() }
          : w,
      ),
    }))
  },

  reorderExercises: (workoutId, exerciseIds) => {
    const workout = get().workouts.find((w) => w.id === workoutId)
    if (!workout) return
    const reordered = exerciseIds
      .map((id) => workout.exercises.find((e) => e.id === id))
      .filter(Boolean) as Exercise[]
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id === workoutId ? { ...w, exercises: reordered, updatedAt: new Date().toISOString() } : w,
      ),
    }))
  },

  updateSet: (workoutId, exerciseId, setId, changes) => {
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id !== workoutId
          ? w
          : {
              ...w,
              exercises: w.exercises.map((e) =>
                e.id !== exerciseId
                  ? e
                  : { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, ...changes } : s)) },
              ),
              updatedAt: new Date().toISOString(),
            },
      ),
    }))
  },

  addSet: (workoutId, exerciseId) => {
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id !== workoutId
          ? w
          : {
              ...w,
              exercises: w.exercises.map((e) =>
                e.id !== exerciseId
                  ? e
                  : {
                      ...e,
                      sets: [...e.sets, { id: genId("s"), reps: e.sets[e.sets.length - 1]?.reps ?? 10, weight: e.sets[e.sets.length - 1]?.weight ?? 0, completed: false }],
                    },
              ),
              updatedAt: new Date().toISOString(),
            },
      ),
    }))
  },

  removeSet: (workoutId, exerciseId, setId) => {
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id !== workoutId
          ? w
          : {
              ...w,
              exercises: w.exercises.map((e) =>
                e.id !== exerciseId ? e : { ...e, sets: e.sets.filter((s) => s.id !== setId) },
              ),
              updatedAt: new Date().toISOString(),
            },
      ),
    }))
  },
}))
