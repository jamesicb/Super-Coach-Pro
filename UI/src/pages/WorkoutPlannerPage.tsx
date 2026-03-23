import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Clock, Pencil, Trash2, Zap, MoreVertical, Search, Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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

const muscleGroupColors: Record<string, string> = {
  Chest:     "bg-blue-100 text-blue-700",
  Back:      "bg-emerald-100 text-emerald-700",
  Legs:      "bg-orange-100 text-orange-700",
  Shoulders: "bg-purple-100 text-purple-700",
  Arms:      "bg-pink-100 text-pink-700",
  Core:      "bg-yellow-100 text-yellow-700",
}

function getUniqueMuscles(workout: Workout): string[] {
  const muscles = workout.exercises.map((e) => e.muscleGroup)
  return [...new Set(muscles)]
}

function WorkoutCard({ workout, onDelete }: { workout: Workout; onDelete: (id: string) => void }) {
  const navigate = useNavigate()
  const muscles = getUniqueMuscles(workout)

  return (
    <Card
      className="flex flex-col hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/workout-planner/${workout.id}/edit`)}
    >
      <CardContent className="flex-1 p-5 space-y-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-snug">{workout.name}</h3>
            {workout.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{workout.description}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 -mr-1"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/workout-planner/${workout.id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/live-workout/${workout.id}`}>
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

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Dumbbell className="h-3.5 w-3.5" />
            {workout.exercises.length} exercises
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            ~{workout.estimatedDuration} min
          </div>
        </div>

        {/* Muscle groups */}
        <div className="flex flex-wrap gap-1">
          {muscles.map((mg) => (
            <span
              key={mg}
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${muscleGroupColors[mg] ?? "bg-gray-100 text-gray-700"}`}
            >
              {mg}
            </span>
          ))}
        </div>

        {/* Exercise preview */}
        <div className="space-y-1.5">
          {workout.exercises.slice(0, 3).map((ex) => (
            <div key={ex.id} className="flex justify-between text-xs">
              <span className="text-foreground/80">{ex.name}</span>
              <span className="text-muted-foreground">
                {ex.weightUnit === "bodyweight"
                  ? `${ex.sets.length}×${ex.sets[0]?.reps} · BW`
                  : `${ex.sets.length}×${ex.sets[0]?.reps}${ex.sets[0]?.weight > 0 ? ` @ ${ex.sets[0].weight}${ex.weightUnit}` : ""}`}
              </span>
            </div>
          ))}
          {workout.exercises.length > 3 && (
            <p className="text-xs text-muted-foreground">+{workout.exercises.length - 3} more</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0">
        <Button
          size="sm"
          className="w-full"
          onClick={(e) => { e.stopPropagation(); navigate(`/live-workout/${workout.id}`) }}
        >
          <Zap className="h-3.5 w-3.5 mr-1.5" /> Start Workout
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function WorkoutPlannerPage() {
  const { workouts, deleteWorkout } = useWorkoutStore()
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
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">My Workouts</h2>
        <Button asChild>
          <Link to="/workout-planner/create">
            <Plus className="h-4 w-4 mr-2" /> Create Workout
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search routines…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          {search ? (
            <>
              <p className="font-medium">No routines match "{search}"</p>
              <p className="text-sm text-muted-foreground">Try a different search term</p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">You haven't created any workouts yet.</p>
              <Button asChild>
                <Link to="/workout-planner/create">Create Your First Workout</Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workout Routine</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>? This action cannot be undone.
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
