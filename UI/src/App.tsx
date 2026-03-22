import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "@/components/AppLayout"
import { Toaster } from "@/components/ui/toaster"

import DashboardPage from "@/pages/DashboardPage"
import WorkoutPlannerPage from "@/pages/WorkoutPlannerPage"
import CreateWorkoutPage from "@/pages/CreateWorkoutPage"
import EditWorkoutPage from "@/pages/EditWorkoutPage"
import DietPlannerPage from "@/pages/DietPlannerPage"
import CalendarPage from "@/pages/CalendarPage"
import LiveWorkoutPage from "@/pages/LiveWorkoutPage"
import ProgressPage from "@/pages/ProgressPage"
import AIChatPage from "@/pages/AIChatPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import NotFoundPage from "@/pages/NotFoundPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* App routes */}
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Workout Planner */}
          <Route path="/workout-planner" element={<WorkoutPlannerPage />} />
          <Route path="/workout-planner/create" element={<CreateWorkoutPage />} />
          <Route path="/workout-planner/:id/edit" element={<EditWorkoutPage />} />

          {/* Other pages */}
          <Route path="/diet-planner" element={<DietPlannerPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/live-workout/:workoutId" element={<LiveWorkoutPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/chat" element={<AIChatPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}
