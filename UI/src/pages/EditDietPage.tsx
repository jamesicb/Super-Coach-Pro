import { Navigate, useParams } from "react-router-dom"
import DietForm from "@/components/diet/DietForm"
import { useDietStore } from "@/store/dietStore"

export default function EditDietPage() {
  const { id } = useParams<{ id: string }>()
  const plan = useDietStore((s) => s.plans.find((p) => p.id === id))

  if (!plan) return <Navigate to="/diet-planner" replace />

  return <DietForm plan={plan} />
}
