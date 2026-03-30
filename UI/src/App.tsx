import { useEffect, lazy, Suspense, Component, type ReactNode } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "@/components/AppLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Toaster } from "@/components/ui/toaster"
import { useAuthStore } from "@/store/authStore"
import { useWorkoutStore } from "@/store/workoutStore"
import { useDietStore } from "@/store/dietStore"
import { useCalendarStore } from "@/store/calendarStore"

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center p-8 text-center">
          <div className="space-y-3 max-w-md">
            <p className="text-lg font-semibold text-destructive">Something went wrong</p>
            <p className="text-sm text-muted-foreground font-mono">{(this.state.error as Error).message}</p>
            <button className="text-sm underline" onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const DashboardPage = lazy(() => import("@/pages/DashboardPage"))
const WorkoutPlannerPage = lazy(() => import("@/pages/WorkoutPlannerPage"))
const CreateWorkoutPage = lazy(() => import("@/pages/CreateWorkoutPage"))
const EditWorkoutPage = lazy(() => import("@/pages/EditWorkoutPage"))
const DietPlannerPage = lazy(() => import("@/pages/DietPlannerPage"))
const CreateDietPage = lazy(() => import("@/pages/CreateDietPage"))
const EditDietPage = lazy(() => import("@/pages/EditDietPage"))
const CalendarPage = lazy(() => import("@/pages/CalendarPage"))
const LiveWorkoutPage = lazy(() => import("@/pages/LiveWorkoutPage"))
const ProgressPage = lazy(() => import("@/pages/ProgressPage"))
const AIChatPage = lazy(() => import("@/pages/AIChatPage"))
const LoginPage = lazy(() => import("@/pages/LoginPage"))
const RegisterPage = lazy(() => import("@/pages/RegisterPage"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))

export default function App() {
  const { initialize, user } = useAuthStore()
  const { loadWorkouts } = useWorkoutStore()
  const { loadPlans } = useDietStore()
  const { loadSchedules } = useCalendarStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (user) {
      loadWorkouts()
      loadPlans()
      loadSchedules()
    }
  }, [user, loadWorkouts, loadPlans, loadSchedules])

  return (
    <ErrorBoundary>
    <BrowserRouter>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
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
      </Suspense>
      <Toaster />
    </BrowserRouter>
    </ErrorBoundary>
  )
}
