import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  CalendarDays,
  Zap,
  TrendingUp,
  MessageSquare,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

const navItems = [
  { to: "/dashboard",       label: "Dashboard",      icon: LayoutDashboard },
  { to: "/workout-planner", label: "Workout Planner", icon: Dumbbell },
  { to: "/diet-planner",    label: "Diet Planner",    icon: UtensilsCrossed },
  { to: "/calendar",        label: "Calendar",        icon: CalendarDays },
  { to: "/live-workout",    label: "Live Workout",     icon: Zap },
  { to: "/progress",        label: "Progress",         icon: TrendingUp },
  { to: "/chat",            label: "AI Coach",         icon: MessageSquare },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-sidebar-border shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="font-bold text-lg tracking-tight">Super Coach</span>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to || location.pathname.startsWith(to + "/")
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
              </NavLink>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">James Doe</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">Build Muscle</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
