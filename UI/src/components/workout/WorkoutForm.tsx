import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ExerciseCard from "@/components/workout/ExerciseCard"
import ExerciseSearchModal from "@/components/workout/ExerciseSearchModal"
import { useWorkoutStore } from "@/store/workoutStore"
import { useToast } from "@/hooks/use-toast"
import type { Workout, Exercise, Set, WeightUnit } from "@/types"
import type { ExerciseTemplate } from "@/lib/serverComm"

interface WorkoutFormProps {
  workout?: Workout
}

let localCounter = 0
function localId(prefix: string) {
  return `${prefix}-local-${Date.now()}-${++localCounter}`
}

function makeDefaultSets(count = 3): Set[] {
  return Array.from({ length: count }, () => ({
    id: localId("s"),
    reps: 10,
    weight: 0,
    completed: false,
  }))
}

export default function WorkoutForm({ workout }: WorkoutFormProps) {
  const navigate = useNavigate()
  const {
    addWorkout,
    updateWorkout,
    addExerciseToWorkout,
    updateExercise,
    removeExerciseFromWorkout,
    updateSet,
    addSet,
    removeSet,
  } = useWorkoutStore()
  const { toast } = useToast()

  const isEdit = !!workout

  const [name, setName] = useState(workout?.name ?? "New Workout")
  const [searchOpen, setSearchOpen] = useState(false)

  // Draft exercises buffered locally in create mode
  const [draftExercises, setDraftExercises] = useState<Exercise[]>([])

  // In edit mode, read live exercises from the store
  const liveWorkout = useWorkoutStore((s) =>
    isEdit ? s.workouts.find((w) => w.id === workout.id) : null,
  )
  const exercises = isEdit ? (liveWorkout?.exercises ?? []) : draftExercises
  const alreadyAdded = exercises.map((e) => e.name)

  // ── Exercise handlers ─────────────────────────────────────────────────────

  function handleAddExercise(ex: ExerciseTemplate) {
    if (isEdit) {
      addExerciseToWorkout(workout.id, { name: ex.name, muscleGroup: ex.muscleGroup, weightUnit: "kg" })
    } else {
      setDraftExercises((prev) => [
        ...prev,
        {
          id: localId("we"),
          name: ex.name,
          muscleGroup: ex.muscleGroup,
          weightUnit: "kg",
          sets: makeDefaultSets(),
        },
      ])
    }
  }

  function draftUpdateSet(exerciseId: string, setId: string, field: "reps" | "weight", value: number) {
    setDraftExercises((prev) =>
      prev.map((e) =>
        e.id !== exerciseId
          ? e
          : { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)) },
      ),
    )
  }

  function draftAddSet(exerciseId: string) {
    setDraftExercises((prev) =>
      prev.map((e) => {
        if (e.id !== exerciseId) return e
        const last = e.sets[e.sets.length - 1]
        return {
          ...e,
          sets: [
            ...e.sets,
            { id: localId("s"), reps: last?.reps ?? 10, weight: last?.weight ?? 0, completed: false },
          ],
        }
      }),
    )
  }

  function draftRemoveSet(exerciseId: string, setId: string) {
    setDraftExercises((prev) =>
      prev.map((e) =>
        e.id !== exerciseId ? e : { ...e, sets: e.sets.filter((s) => s.id !== setId) },
      ),
    )
  }

  function draftRemoveExercise(exerciseId: string) {
    setDraftExercises((prev) => prev.filter((e) => e.id !== exerciseId))
  }

  function draftUpdateUnit(exerciseId: string, unit: WeightUnit) {
    setDraftExercises((prev) =>
      prev.map((e) => (e.id !== exerciseId ? e : { ...e, weightUnit: unit })),
    )
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  function handleSave() {
    if (!name.trim()) {
      toast({ title: "Name required", description: "Please give your workout a name.", variant: "destructive" })
      return
    }
    if (isEdit) {
      updateWorkout(workout.id, { name: name.trim() })
      toast({ title: "Workout updated", description: `"${name}" has been saved.` })
    } else {
      addWorkout({ name: name.trim(), description: "", estimatedDuration: 60, exercises: draftExercises })
      toast({ title: "Workout created", description: `"${name}" has been saved.` })
    }
    navigate("/workout-planner")
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/workout-planner")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">{isEdit ? "Edit Workout" : "Create New Workout"}</h2>
      </div>

      {/* Workout name */}
      <Input
        placeholder="Workout name…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-base"
      />

      {/* Exercises section */}
      <div className="rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Selected Exercises</h3>
          {exercises.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setSearchOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Exercise
            </Button>
          )}
        </div>

        {exercises.length === 0 ? (
          <div className="py-8 flex justify-center">
            <Button onClick={() => setSearchOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Your First Exercise
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {exercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onUpdateSet={
                  isEdit
                    ? (eid, sid, field, val) => updateSet(workout.id, eid, sid, { [field]: val })
                    : draftUpdateSet
                }
                onAddSet={isEdit ? (eid) => addSet(workout.id, eid) : draftAddSet}
                onRemoveSet={
                  isEdit ? (eid, sid) => removeSet(workout.id, eid, sid) : draftRemoveSet
                }
                onRemoveExercise={
                  isEdit ? (eid) => removeExerciseFromWorkout(workout.id, eid) : draftRemoveExercise
                }
                onUpdateUnit={
                  isEdit
                    ? (eid, unit) => updateExercise(workout.id, eid, { weightUnit: unit })
                    : draftUpdateUnit
                }
              />
            ))}

            <button
              className="w-full border-2 border-dashed border-border rounded-lg py-4 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2"
              onClick={() => setSearchOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add another exercise
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={() => navigate("/workout-planner")}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          {isEdit ? "Save Changes" : "Save Workout"}
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
