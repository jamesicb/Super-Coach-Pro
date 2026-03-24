import { EXERCISE_LIBRARY, type ExerciseTemplate } from "@/mock/exercises"
import { MOCK_WORKOUTS } from "@/mock/workouts"
import type { Workout } from "@/types"

export type { ExerciseTemplate }

const SERVER_URL = import.meta.env.VITE_SERVER_URL

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function serverFetch(path: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    const res = await fetch(`${SERVER_URL}${path}`, { signal: controller.signal, ...init })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res
  } catch (e) {
    clearTimeout(timeout)
    throw e
  }
}

// ─── Exercises ────────────────────────────────────────────────────────────────

export async function getExercises(): Promise<ExerciseTemplate[]> {
  if (!SERVER_URL) return EXERCISE_LIBRARY
  try {
    const res = await serverFetch("/exercises")
    return res.json()
  } catch {
    return EXERCISE_LIBRARY
  }
}

// ─── Workouts ────────────────────────────────────────────────────────────────

export async function getWorkouts(): Promise<Workout[]> {
  if (!SERVER_URL) return MOCK_WORKOUTS
  try {
    const res = await serverFetch("/workouts")
    return res.json()
  } catch {
    return MOCK_WORKOUTS
  }
}

export async function getWorkout(id: string): Promise<Workout | null> {
  if (!SERVER_URL) return MOCK_WORKOUTS.find((w) => w.id === id) ?? null
  try {
    const res = await serverFetch(`/workouts/${encodeURIComponent(id)}`)
    return res.json()
  } catch {
    return MOCK_WORKOUTS.find((w) => w.id === id) ?? null
  }
}

export async function createWorkout(workout: Workout): Promise<Workout> {
  if (!SERVER_URL) return workout
  const res = await serverFetch("/workouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workout),
  })
  return res.json()
}

export async function updateWorkout(id: string, workout: Workout): Promise<Workout> {
  if (!SERVER_URL) return workout
  const res = await serverFetch(`/workouts/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workout),
  })
  return res.json()
}

export async function deleteWorkout(id: string): Promise<void> {
  if (!SERVER_URL) return
  await serverFetch(`/workouts/${encodeURIComponent(id)}`, { method: "DELETE" })
}
