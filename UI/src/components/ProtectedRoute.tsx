import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"

export default function ProtectedRoute() {
  const { user, initialized } = useAuthStore()

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
