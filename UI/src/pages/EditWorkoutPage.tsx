import { useParams, Navigate } from "react-router-dom"
import WorkoutForm from "@/components/workout/WorkoutForm"
import { useWorkoutStore } from "@/store/workoutStore"

export default function EditWorkoutPage() {
  const { id } = useParams<{ id: string }>()
  const workout = useWorkoutStore((s) => s.workouts.find((w) => w.id === id))

  if (!workout) {
    return <Navigate to="/workout-planner" replace />
  }

  return <WorkoutForm workout={workout} />
}
