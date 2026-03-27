import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "@/components/AppLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Toaster } from "@/components/ui/toaster"
import { useAuthStore } from "@/store/authStore"
import { useWorkoutStore } from "@/store/workoutStore"
import { useDietStore } from "@/store/dietStore"

import DashboardPage from "@/pages/DashboardPage"
import WorkoutPlannerPage from "@/pages/WorkoutPlannerPage"
import CreateWorkoutPage from "@/pages/CreateWorkoutPage"
import EditWorkoutPage from "@/pages/EditWorkoutPage"
import DietPlannerPage from "@/pages/DietPlannerPage"
import CreateDietPage from "@/pages/CreateDietPage"
import EditDietPage from "@/pages/EditDietPage"
import CalendarPage from "@/pages/CalendarPage"
import LiveWorkoutPage from "@/pages/LiveWorkoutPage"
import ProgressPage from "@/pages/ProgressPage"
import AIChatPage from "@/pages/AIChatPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import NotFoundPage from "@/pages/NotFoundPage"

export default function App() {
  const { initialize, user } = useAuthStore()
  const { loadWorkouts } = useWorkoutStore()
  const { loadPlans } = useDietStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (user) {
      loadWorkouts()
      loadPlans()
    }
  }, [user, loadWorkouts, loadPlans])

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected app routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Workout Planner */}
            <Route path="/workout-planner" element={<WorkoutPlannerPage />} />
            <Route path="/workout-planner/create" element={<CreateWorkoutPage />} />
            <Route path="/workout-planner/:id/edit" element={<EditWorkoutPage />} />

            {/* Diet Planner */}
            <Route path="/diet-planner" element={<DietPlannerPage />} />
            <Route path="/diet-planner/create" element={<CreateDietPage />} />
            <Route path="/diet-planner/:id/edit" element={<EditDietPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/live-workout/:workoutId" element={<LiveWorkoutPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/chat" element={<AIChatPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}
