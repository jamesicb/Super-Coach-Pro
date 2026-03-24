// ─── Exercise library (static, no DB needed) ────────────────────────────────

export interface ExerciseTemplate {
  id: string
  name: string
  category: string
  muscleGroup: string
  equipment: string
  description: string
}

const EXERCISE_LIBRARY: ExerciseTemplate[] = [
  // Chest
  { id: "ex-001", name: "Bench Press",            category: "Strength", muscleGroup: "Chest",     equipment: "Barbell",    description: "Compound push movement targeting pectorals." },
  { id: "ex-002", name: "Incline Dumbbell Press", category: "Strength", muscleGroup: "Chest",     equipment: "Dumbbell",   description: "Upper chest focused press on incline bench." },
  { id: "ex-003", name: "Cable Fly",              category: "Strength", muscleGroup: "Chest",     equipment: "Cable",      description: "Isolation fly for inner chest." },
  { id: "ex-004", name: "Push-Up",                category: "Strength", muscleGroup: "Chest",     equipment: "Bodyweight", description: "Classic bodyweight chest exercise." },
  { id: "ex-005", name: "Dips",                   category: "Strength", muscleGroup: "Chest",     equipment: "Bodyweight", description: "Compound movement for lower chest and triceps." },

  // Back
  { id: "ex-006", name: "Deadlift",                  category: "Strength", muscleGroup: "Back",      equipment: "Barbell",    description: "King of compound lifts, full posterior chain." },
  { id: "ex-007", name: "Pull-Up",                   category: "Strength", muscleGroup: "Back",      equipment: "Bodyweight", description: "Vertical pull for lat development." },
  { id: "ex-008", name: "Barbell Row",               category: "Strength", muscleGroup: "Back",      equipment: "Barbell",    description: "Horizontal pull for mid-back thickness." },
  { id: "ex-009", name: "Lat Pulldown",              category: "Strength", muscleGroup: "Back",      equipment: "Cable",      description: "Vertical pull targeting the lats." },
  { id: "ex-010", name: "Seated Cable Row",          category: "Strength", muscleGroup: "Back",      equipment: "Cable",      description: "Horizontal pull for rhomboids and mid-back." },
  { id: "ex-011", name: "Single Arm Dumbbell Row",   category: "Strength", muscleGroup: "Back",      equipment: "Dumbbell",   description: "Unilateral row for balance and thickness." },

  // Legs
  { id: "ex-012", name: "Barbell Squat",         category: "Strength", muscleGroup: "Legs",      equipment: "Barbell",    description: "Primary quad and glute compound lift." },
  { id: "ex-013", name: "Romanian Deadlift",     category: "Strength", muscleGroup: "Legs",      equipment: "Barbell",    description: "Hip hinge targeting hamstrings and glutes." },
  { id: "ex-014", name: "Leg Press",             category: "Strength", muscleGroup: "Legs",      equipment: "Machine",    description: "Quad dominant compound leg press." },
  { id: "ex-015", name: "Walking Lunges",        category: "Strength", muscleGroup: "Legs",      equipment: "Dumbbell",   description: "Unilateral leg movement for balance and strength." },
  { id: "ex-016", name: "Leg Curl",              category: "Strength", muscleGroup: "Legs",      equipment: "Machine",    description: "Isolation for hamstrings." },
  { id: "ex-017", name: "Calf Raise",            category: "Strength", muscleGroup: "Legs",      equipment: "Machine",    description: "Isolation for gastrocnemius and soleus." },
  { id: "ex-018", name: "Bulgarian Split Squat", category: "Strength", muscleGroup: "Legs",      equipment: "Dumbbell",   description: "Advanced unilateral squat for quad hypertrophy." },

  // Shoulders
  { id: "ex-019", name: "Overhead Press",         category: "Strength", muscleGroup: "Shoulders", equipment: "Barbell",    description: "Compound shoulder press targeting deltoids." },
  { id: "ex-020", name: "Dumbbell Lateral Raise", category: "Strength", muscleGroup: "Shoulders", equipment: "Dumbbell",   description: "Isolation for medial delts." },
  { id: "ex-021", name: "Face Pull",              category: "Strength", muscleGroup: "Shoulders", equipment: "Cable",      description: "Rear delt and external rotation exercise." },
  { id: "ex-022", name: "Arnold Press",           category: "Strength", muscleGroup: "Shoulders", equipment: "Dumbbell",   description: "Rotational dumbbell press for full delt engagement." },

  // Arms
  { id: "ex-023", name: "Barbell Curl",     category: "Strength", muscleGroup: "Arms",      equipment: "Barbell",    description: "Classic bicep curl for peak development." },
  { id: "ex-024", name: "Hammer Curl",     category: "Strength", muscleGroup: "Arms",      equipment: "Dumbbell",   description: "Neutral grip curl targeting brachialis." },
  { id: "ex-025", name: "Tricep Pushdown", category: "Strength", muscleGroup: "Arms",      equipment: "Cable",      description: "Isolation for tricep lateral head." },
  { id: "ex-026", name: "Skull Crusher",   category: "Strength", muscleGroup: "Arms",      equipment: "Barbell",    description: "Lying tricep extension for long head." },
  { id: "ex-027", name: "Preacher Curl",   category: "Strength", muscleGroup: "Arms",      equipment: "Barbell",    description: "Strict bicep curl on preacher bench." },

  // Core
  { id: "ex-028", name: "Plank",              category: "Strength", muscleGroup: "Core",      equipment: "Bodyweight", description: "Isometric core stability exercise." },
  { id: "ex-029", name: "Cable Crunch",       category: "Strength", muscleGroup: "Core",      equipment: "Cable",      description: "Weighted crunch for rectus abdominis." },
  { id: "ex-030", name: "Hanging Leg Raise",  category: "Strength", muscleGroup: "Core",      equipment: "Bodyweight", description: "Lower ab focused movement." },
  { id: "ex-031", name: "Ab Wheel Rollout",   category: "Strength", muscleGroup: "Core",      equipment: "Equipment",  description: "Full core anti-extension exercise." },

  // Cardio
  { id: "ex-032", name: "Treadmill Run",      category: "Cardio",   muscleGroup: "Legs",      equipment: "Machine",    description: "Steady-state or interval running on treadmill." },
  { id: "ex-033", name: "Rowing Machine",     category: "Cardio",   muscleGroup: "Back",      equipment: "Machine",    description: "Full-body low-impact cardio and endurance." },
  { id: "ex-034", name: "Jump Rope",          category: "Cardio",   muscleGroup: "Core",      equipment: "Bodyweight", description: "High intensity jump rope for conditioning." },
  { id: "ex-035", name: "Stationary Bike",    category: "Cardio",   muscleGroup: "Legs",      equipment: "Machine",    description: "Low-impact cycling for cardiovascular fitness." },

  // Flexibility
  { id: "ex-036", name: "Hip Flexor Stretch", category: "Flexibility", muscleGroup: "Legs",      equipment: "Bodyweight", description: "Deep lunge stretch targeting the hip flexors." },
  { id: "ex-037", name: "Shoulder Stretch",   category: "Flexibility", muscleGroup: "Shoulders", equipment: "Bodyweight", description: "Cross-body stretch for shoulder mobility." },
  { id: "ex-038", name: "Hamstring Stretch",  category: "Flexibility", muscleGroup: "Legs",      equipment: "Bodyweight", description: "Seated or standing stretch for hamstring flexibility." },
]

// ─── Supabase types ──────────────────────────────────────────────────────────

interface WorkoutRow {
  id: string
  name: string
  description: string | null
  exercises: unknown[]
  estimated_duration: number
  created_at: string
  updated_at: string
}

interface WorkoutShape {
  id: string
  name: string
  description?: string
  exercises: unknown[]
  estimatedDuration: number
  createdAt: string
  updatedAt: string
}

function rowToWorkout(row: WorkoutRow): WorkoutShape {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    exercises: row.exercises,
    estimatedDuration: row.estimated_duration,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function workoutToRow(w: WorkoutShape): Omit<WorkoutRow, "created_at"> & { created_at?: string } {
  return {
    id: w.id,
    name: w.name,
    description: w.description ?? null,
    exercises: w.exercises,
    estimated_duration: w.estimatedDuration,
    created_at: w.createdAt,
    updated_at: new Date().toISOString(),
  }
}

// ─── Supabase REST helpers ───────────────────────────────────────────────────

function sbHeaders(env: Env, extra: Record<string, string> = {}): HeadersInit {
  return {
    apikey: env.SUPABASE_ANON_KEY,
    Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  }
}

async function sbFetch(url: string, init: RequestInit): Promise<Response> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Supabase error ${res.status}: ${text}`)
  }
  return res
}

// ─── CORS ────────────────────────────────────────────────────────────────────

function corsHeaders(origin: string | null): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }
}

// ─── Worker ──────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const origin = request.headers.get("Origin")
    const cors = corsHeaders(origin)

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors })
    }

    // ── /health ──────────────────────────────────────────────────────────────
    if (url.pathname === "/health") {
      return Response.json({ status: "ok", app: "Super Coach Pro" }, { headers: cors })
    }

    // ── /exercises ───────────────────────────────────────────────────────────
    if (url.pathname === "/exercises" && request.method === "GET") {
      return Response.json(EXERCISE_LIBRARY, { headers: cors })
    }

    // ── /workouts ─────────────────────────────────────────────────────────────
    const base = `${env.SUPABASE_URL}/rest/v1/workouts`
    const sbH = sbHeaders.bind(null, env)

    // GET /workouts
    if (url.pathname === "/workouts" && request.method === "GET") {
      const res = await sbFetch(`${base}?select=*&order=created_at.desc`, {
        headers: sbH(),
      })
      const rows: WorkoutRow[] = await res.json()
      return Response.json(rows.map(rowToWorkout), { headers: cors })
    }

    // POST /workouts
    if (url.pathname === "/workouts" && request.method === "POST") {
      const body = await request.json() as WorkoutShape
      const row = workoutToRow(body)
      const res = await sbFetch(base, {
        method: "POST",
        headers: sbH({ Prefer: "return=representation" }),
        body: JSON.stringify(row),
      })
      const rows: WorkoutRow[] = await res.json()
      return Response.json(rowToWorkout(rows[0]), { status: 201, headers: cors })
    }

    // Routes with /:id
    const idMatch = url.pathname.match(/^\/workouts\/([^/]+)$/)
    if (idMatch) {
      const id = idMatch[1]
      const byId = `${base}?id=eq.${encodeURIComponent(id)}`

      // GET /workouts/:id
      if (request.method === "GET") {
        const res = await sbFetch(`${byId}&select=*`, { headers: sbH() })
        const rows: WorkoutRow[] = await res.json()
        if (rows.length === 0) {
          return Response.json({ message: "Not found" }, { status: 404, headers: cors })
        }
        return Response.json(rowToWorkout(rows[0]), { headers: cors })
      }

      // PUT /workouts/:id
      if (request.method === "PUT") {
        const body = await request.json() as WorkoutShape
        const row = workoutToRow(body)
        const res = await sbFetch(byId, {
          method: "PATCH",
          headers: sbH({ Prefer: "return=representation" }),
          body: JSON.stringify(row),
        })
        const rows: WorkoutRow[] = await res.json()
        if (rows.length === 0) {
          return Response.json({ message: "Not found" }, { status: 404, headers: cors })
        }
        return Response.json(rowToWorkout(rows[0]), { headers: cors })
      }

      // DELETE /workouts/:id
      if (request.method === "DELETE") {
        await sbFetch(byId, { method: "DELETE", headers: sbH() })
        return new Response(null, { status: 204, headers: cors })
      }
    }

    return Response.json({ message: "Not found" }, { status: 404, headers: cors })
  },
} satisfies ExportedHandler<Env>
