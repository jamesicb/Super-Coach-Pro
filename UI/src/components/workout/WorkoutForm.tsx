import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, ArrowLeft, Save, Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import ExerciseCard from "@/components/workout/ExerciseCard"
import ExerciseSearchModal from "@/components/workout/ExerciseSearchModal"
import { useWorkoutStore } from "@/store/workoutStore"
import { useToast } from "@/hooks/use-toast"
import type { Workout } from "@/types"
import type { ExerciseTemplate } from "@/mock/exercises"

interface WorkoutFormProps {
  /** When provided, the form is in edit mode */
  workout?: Workout
}

export default function WorkoutForm({ workout }: WorkoutFormProps) {
  const navigate = useNavigate()
  const { addWorkout, updateWorkout, addExerciseToWorkout, updateExercise, removeExerciseFromWorkout, updateSet, addSet, removeSet } =
    useWorkoutStore()
  const { toast } = useToast()

  const isEdit = !!workout

  // Local form state — synced with the store only on Save
  const [name, setName] = useState(workout?.name ?? "")
  const [description, setDescription] = useState(workout?.description ?? "")
  const [duration, setDuration] = useState(workout?.estimatedDuration ?? 60)
  const [searchOpen, setSearchOpen] = useState(false)

  // For a new workout we buffer edits until Save; for edit mode we use the live store
  const [draftId] = useState<string | null>(() => {
    if (isEdit) return workout.id
    return null
  })

  // In edit mode, read exercises from the store (live); in create mode, track locally
  const liveWorkout = useWorkoutStore((s) => (draftId ? s.workouts.find((w) => w.id === draftId) : null))
  const exercises = liveWorkout?.exercises ?? []

  const alreadyAdded = exercises.map((e) => e.name)

  function handleAddExercise(ex: ExerciseTemplate) {
    if (!draftId) {
      toast({ title: "Please save the workout first", description: "Fill in the name then hit Save to start adding exercises." })
      return
    }
    addExerciseToWorkout(draftId, { name: ex.name, muscleGroup: ex.muscleGroup, weightUnit: "kg" })
  }

  function handleSave() {
    if (!name.trim()) {
      toast({ title: "Name required", description: "Please give your workout a name.", variant: "destructive" })
      return
    }
    if (isEdit && draftId) {
      updateWorkout(draftId, { name: name.trim(), description: description.trim(), estimatedDuration: duration })
      toast({ title: "Workout updated", description: `"${name}" has been saved.` })
      navigate("/workout-planner")
    } else {
      const newWorkout = addWorkout({ name: name.trim(), description: description.trim(), estimatedDuration: duration, exercises: [] })
      toast({ title: "Workout created", description: `"${name}" is ready. Now add some exercises!` })
      navigate(`/workout-planner/${newWorkout.id}/edit`)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/workout-planner")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{isEdit ? "Edit Routine" : "Create Routine"}</h2>
          <p className="text-sm text-muted-foreground">{isEdit ? "Update your workout details and exercises" : "Build a new workout routine"}</p>
        </div>
      </div>

      {/* Details */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workout Name *</Label>
            <Input
              id="name"
              placeholder="e.g. Push Day — Chest & Shoulders"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe this routine…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2 max-w-[160px]">
            <Label htmlFor="duration">Est. Duration (min)</Label>
            <Input
              id="duration"
              type="number"
              min={5}
              max={240}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Exercises section (only shown in edit mode or after first save) */}
      {draftId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Exercises{" "}
              <span className="text-sm font-normal text-muted-foreground">({exercises.length})</span>
            </h3>
            <Button variant="outline" size="sm" onClick={() => setSearchOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Exercise
            </Button>
          </div>

          {exercises.length === 0 ? (
            <div
              className="border-2 border-dashed border-border rounded-lg py-12 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
              onClick={() => setSearchOpen(true)}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Dumbbell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">No exercises yet</p>
              <p className="text-xs text-muted-foreground">Click to browse the exercise library</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exercises.map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  onUpdateSet={(exerciseId, setId, field, value) =>
                    updateSet(draftId, exerciseId, setId, { [field]: value })
                  }
                  onAddSet={(exerciseId) => addSet(draftId, exerciseId)}
                  onRemoveSet={(exerciseId, setId) => removeSet(draftId, exerciseId, setId)}
                  onRemoveExercise={(exerciseId) => removeExerciseFromWorkout(draftId, exerciseId)}
                  onUpdateUnit={(exerciseId, unit) => updateExercise(draftId, exerciseId, { weightUnit: unit })}
                />
              ))}

              {/* Add more button at bottom of list */}
              <button
                className="w-full border-2 border-dashed border-border rounded-lg py-4 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2"
                onClick={() => setSearchOpen(true)}
              >
                <Plus className="h-4 w-4" /> Add another exercise
              </button>
            </div>
          )}
        </div>
      )}

      {/* Save button */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={() => navigate("/workout-planner")}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          {isEdit ? "Save Changes" : "Create Workout"}
        </Button>
      </div>

      <ExerciseSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleAddExercise}
        alreadyAdded={alreadyAdded}
      />
    </div>
  )
}
