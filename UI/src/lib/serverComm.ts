import { EXERCISE_LIBRARY, type ExerciseTemplate } from "@/mock/exercises"
import type { Workout, MealPlan, WorkoutSchedule } from "@/types"
import { supabase } from "@/lib/supabase"

export type { ExerciseTemplate }

const SERVER_URL = import.meta.env.VITE_SERVER_URL

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

async function serverFetch(path: string, init?: RequestInit, timeoutMs = 5000): Promise<Response> {
  const token = await getAuthToken()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${SERVER_URL}${path}`, {
      signal: controller.signal,
      ...init,
      headers: {
        ...(init?.headers as Record<string, string> | undefined),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    clearTimeout(timeout)
    if (!res.ok) {
      let msg = `HTTP ${res.status}`
      try {
        const body = await res.clone().json() as { message?: string }
        if (body.message) msg = body.message
      } catch { /* ignore */ }
      throw new Error(msg)
    }
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
  if (!SERVER_URL) return []
  try {
    const res = await serverFetch("/workouts")
    return res.json()
  } catch {
    return []
  }
}

export async function getWorkout(id: string): Promise<Workout | null> {
  if (!SERVER_URL) return null
  try {
    const res = await serverFetch(`/workouts/${encodeURIComponent(id)}`)
    return res.json()
  } catch {
    return null
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

// ─── Meal Plans ───────────────────────────────────────────────────────────────

export async function getMealPlans(): Promise<MealPlan[]> {
  if (!SERVER_URL) return []
  try {
    const res = await serverFetch("/meal-plans")
    return res.json()
  } catch {
    return []
  }
}

export async function createMealPlan(plan: MealPlan): Promise<MealPlan> {
  if (!SERVER_URL) return plan
  const res = await serverFetch("/meal-plans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plan),
  })
  return res.json()
}

export async function updateMealPlan(id: string, plan: MealPlan): Promise<MealPlan> {
  if (!SERVER_URL) return plan
  const res = await serverFetch(`/meal-plans/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plan),
  })
  return res.json()
}

export async function deleteMealPlan(id: string): Promise<void> {
  if (!SERVER_URL) return
  await serverFetch(`/meal-plans/${encodeURIComponent(id)}`, { method: "DELETE" })
}

// ─── Schedules ────────────────────────────────────────────────────────────────

export async function getSchedules(): Promise<WorkoutSchedule[]> {
  if (!SERVER_URL) return []
  try {
    const res = await serverFetch("/schedules")
    return res.json()
  } catch {
    return []
  }
}

export async function createSchedule(schedule: WorkoutSchedule): Promise<WorkoutSchedule> {
  if (!SERVER_URL) return schedule
  const res = await serverFetch("/schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  })
  return res.json()
}

export async function deleteSchedule(id: string): Promise<void> {
  if (!SERVER_URL) return
  await serverFetch(`/schedules/${encodeURIComponent(id)}`, { method: "DELETE" })
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────

export interface ChatTurn {
  role: "user" | "assistant"
  content: string
}

export async function sendChatMessage(messages: ChatTurn[]): Promise<string> {
  if (!SERVER_URL) {
    await new Promise((r) => setTimeout(r, 800))
    return "I'm currently running in offline mode. Connect to the server to get real AI coaching responses."
  }
  const res = await serverFetch(
    "/chat",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    },
    60000,
  )
  const data: { reply: string } = await res.json()
  return data.reply
}
