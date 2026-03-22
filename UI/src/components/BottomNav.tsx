import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Dumbbell,
  Zap,
  TrendingUp,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/dashboard",       label: "Home",     icon: LayoutDashboard },
  { to: "/workout-planner", label: "Workouts", icon: Dumbbell },
  { to: "/live-workout",    label: "Live",     icon: Zap },
  { to: "/progress",        label: "Progress", icon: TrendingUp },
  { to: "/chat",            label: "AI Coach", icon: MessageSquare },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + "/")
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", to === "/live-workout" && isActive && "text-primary")} />
              <span>{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
