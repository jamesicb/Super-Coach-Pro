import { useState } from "react"
import { Trash2, Plus, Minus, ChevronDown, ChevronRight } from "lucide-react"
import type { Exercise, WeightUnit } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ExerciseCardProps {
  exercise: Exercise
  onUpdateSet: (exerciseId: string, setId: string, field: "reps" | "weight", value: number) => void
  onAddSet: (exerciseId: string) => void
  onRemoveSet: (exerciseId: string, setId: string) => void
  onRemoveExercise: (exerciseId: string) => void
  onUpdateUnit: (exerciseId: string, unit: WeightUnit) => void
}

const muscleGroupColors: Record<string, string> = {
  Chest:     "bg-blue-100 text-blue-700",
  Back:      "bg-emerald-100 text-emerald-700",
  Legs:      "bg-orange-100 text-orange-700",
  Shoulders: "bg-purple-100 text-purple-700",
  Arms:      "bg-pink-100 text-pink-700",
  Core:      "bg-yellow-100 text-yellow-700",
}

const UNITS: { value: WeightUnit; label: string }[] = [
  { value: "kg", label: "kg" },
  { value: "lb", label: "lb" },
  { value: "bodyweight", label: "BW" },
]

export default function ExerciseCard({
  exercise,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
  onUpdateUnit,
}: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(true)
  const colorClass = muscleGroupColors[exercise.muscleGroup] ?? "bg-gray-100 text-gray-700"
  const isBW = exercise.weightUnit === "bodyweight"

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header — click to expand/collapse */}
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer select-none hover:bg-muted/40 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="text-muted-foreground shrink-0">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>

        <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm">{exercise.name}</span>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
            {exercise.muscleGroup}
          </span>
          {exercise.notes && (
            <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[180px]">
              {exercise.notes}
            </span>
          )}
        </div>

        {/* Unit toggle — stop propagation so it doesn't collapse the card */}
        <div
          className="flex items-center rounded-md border border-border overflow-hidden text-xs shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {UNITS.map((u) => (
            <button
              key={u.value}
              type="button"
              onClick={() => onUpdateUnit(exercise.id, u.value)}
              className={cn(
                "px-2 py-1 text-xs leading-none transition-colors",
                exercise.weightUnit === u.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {u.label}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
          onClick={(e) => { e.stopPropagation(); onRemoveExercise(exercise.id) }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="px-4 pb-3 space-y-2 border-t border-border/60 pt-3">
          {/* Column headers */}
          <div className={cn(
            "grid gap-2 text-xs font-medium text-muted-foreground px-1",
            isBW ? "grid-cols-[2rem_1fr_2rem]" : "grid-cols-[2rem_1fr_1fr_2rem]",
          )}>
            <span>Set</span>
            <span>Reps</span>
            {!isBW && <span>Weight</span>}
            <span />
          </div>

          {/* Set rows */}
          <div className="space-y-1.5">
            {exercise.sets.map((set, idx) => (
              <div
                key={set.id}
                className={cn(
                  "grid gap-2 items-center",
                  isBW ? "grid-cols-[2rem_1fr_2rem]" : "grid-cols-[2rem_1fr_1fr_2rem]",
                )}
              >
                <span className="text-xs font-medium text-muted-foreground text-center">{idx + 1}</span>
                <Input
                  type="number"
                  min={1}
                  value={set.reps}
                  onChange={(e) => onUpdateSet(exercise.id, set.id, "reps", Number(e.target.value))}
                  className="h-8 text-sm text-center"
                />
                {!isBW && (
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={set.weight}
                    onChange={(e) => onUpdateSet(exercise.id, set.id, "weight", Number(e.target.value))}
                    className="h-8 text-sm text-center"
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemoveSet(exercise.id, set.id)}
                  disabled={exercise.sets.length <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add set */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 text-xs border border-dashed border-border"
            onClick={() => onAddSet(exercise.id)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Set
          </Button>
        </div>
      )}
    </div>
  )
}
