export interface ExerciseTemplate {
  id: string
  name: string
  category: string
  muscleGroup: string
  equipment: string
  description: string
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:8788"

export async function getExercises(): Promise<ExerciseTemplate[]> {
  const res = await fetch(`${SERVER_URL}/exercises`)
  if (!res.ok) throw new Error(`Failed to fetch exercises: ${res.status}`)
  return res.json() as Promise<ExerciseTemplate[]>
}
