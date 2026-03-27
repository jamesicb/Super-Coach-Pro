import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Pencil, Trash2, Zap, MoreVertical, Search, Dumbbell, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useWorkoutStore } from "@/store/workoutStore"
import { useToast } from "@/hooks/use-toast"
import type { Workout } from "@/types"

// ─── Workout card ─────────────────────────────────────────────────────────────

function WorkoutCard({ workout, onDelete }: { workout: Workout; onDelete: (id: string) => void }) {
  const navigate = useNavigate()
  const exCount = workout.exercises.length

  return (
    <div
      className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
      onClick={() => navigate(`/workout-planner/${workout.id}/edit`)}
    >
      {/* Left: name + summary */}
      <div className="min-w-0">
        <p className="font-semibold text-base leading-snug truncate">{workout.name}</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {exCount} exercise{exCount !== 1 ? "s" : ""} &middot; ~{workout.estimatedDuration} min
        </p>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); navigate(`/live-workout/${workout.id}`) }}
        >
          <Zap className="h-3.5 w-3.5" /> Start
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/workout-planner/${workout.id}/edit`} onClick={(e) => e.stopPropagation()}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/live-workout/${workout.id}`} onClick={(e) => e.stopPropagation()}>
                <Zap className="h-4 w-4 mr-2" /> Start Workout
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => { e.stopPropagation(); onDelete(workout.id) }}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkoutPlannerPage() {
  const { workouts, deleteWorkout, syncing } = useWorkoutStore()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Workout | null>(null)

  const filtered = workouts.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.description?.toLowerCase().includes(search.toLowerCase()),
  )

  function handleDelete(id: string) {
    const workout = workouts.find((w) => w.id === id)
    if (workout) setDeleteTarget(workout)
  }

  function confirmDelete() {
    if (!deleteTarget) return
    deleteWorkout(deleteTarget.id)
    toast({ title: "Workout deleted", description: `"${deleteTarget.name}" has been removed.` })
    setDeleteTarget(null)
  }

  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">

      {/* ── Workout Planner header ── */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Dumbbell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Workout Planner</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Build and manage your personal training routines.
            </p>
          </div>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/workout-planner/create">
            <Plus className="h-4 w-4 mr-2" /> Create Workout
          </Link>
        </Button>
      </div>

      {/* ── My Workouts section ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">My Workouts</h3>
          {workouts.length > 0 && (
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {workouts.length}
            </span>
          )}
        </div>

        {/* Search */}
        {workouts.length > 0 && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workouts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* Loading state */}
        {syncing ? (
          <div className="flex items-center gap-3 py-8 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="text-sm">Loading your workouts…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center space-y-3">
            {search ? (
              <>
                <p className="font-medium">No workouts match "{search}"</p>
                <p className="text-sm text-muted-foreground">Try a different search term</p>
              </>
            ) : (
              <>
                <Dumbbell className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="font-medium text-muted-foreground">No saved workouts yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your first workout and it will appear here.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link to="/workout-planner/create">
                    <Plus className="h-4 w-4 mr-1.5" /> Create Workout
                  </Link>
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workout</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
