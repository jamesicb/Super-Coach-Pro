import { useState } from "react"
import { ArrowLeft, Calendar, Check, Dumbbell, Repeat } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWorkoutStore } from "@/store/workoutStore"
import { useCalendarStore } from "@/store/calendarStore"
import { useToast } from "@/hooks/use-toast"
import type { Workout } from "@/types"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ScheduleWorkoutDialog({ open, onOpenChange }: Props) {
  const { workouts } = useWorkoutStore()
  const { addSchedule } = useCalendarStore()
  const { toast } = useToast()

  const [step, setStep] = useState<1 | 2>(1)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [frequency, setFrequency] = useState<"once" | "recurring">("once")
  const [date, setDate] = useState("")
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])
  const [saving, setSaving] = useState(false)

  function reset() {
    setStep(1)
    setSelectedWorkout(null)
    setFrequency("once")
    setDate("")
    setDaysOfWeek([])
    setSaving(false)
  }

  function handleClose(open: boolean) {
    if (!open) reset()
    onOpenChange(open)
  }

  function handleSelectWorkout(workout: Workout) {
    setSelectedWorkout(workout)
    setStep(2)
  }

  function toggleDay(day: number) {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    )
  }

  async function handleSchedule() {
    if (!selectedWorkout) return
    if (frequency === "once" && !date) return
    if (frequency === "recurring" && daysOfWeek.length === 0) return

    setSaving(true)
    try {
      await addSchedule({
        workoutId: selectedWorkout.id,
        workoutName: selectedWorkout.name,
        frequency,
        date: frequency === "once" ? date : undefined,
        daysOfWeek: frequency === "recurring" ? [...daysOfWeek].sort() : undefined,
      })
      toast({
        title: "Workout scheduled",
        description:
          frequency === "once"
            ? `"${selectedWorkout.name}" added on ${date}.`
            : `"${selectedWorkout.name}" added as a recurring workout.`,
      })
      handleClose(false)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save schedule."
      const isTableMissing = msg.toLowerCase().includes("relation") || msg.toLowerCase().includes("does not exist") || msg.includes("404")
      toast({
        title: "Error",
        description: isTableMissing
          ? "Database table missing. Run the SQL in supabase/schema.sql in your Supabase SQL Editor."
          : msg,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const canSubmit =
    !!selectedWorkout &&
    ((frequency === "once" && !!date) || (frequency === "recurring" && daysOfWeek.length > 0))

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step === 2 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 -ml-1 shrink-0"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>{step === 1 ? "Choose a Workout" : "Set Frequency"}</DialogTitle>
          </div>
          {/* Step indicator */}
          <div className="flex gap-1.5 mt-3">
            {([1, 2] as const).map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        {step === 1 ? (
          /* ── Step 1: Workout picker ── */
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1 -mr-1">
            {workouts.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No workouts yet — create one in the Workout Planner first.
              </div>
            ) : (
              workouts.map((workout) => (
                <button
                  key={workout.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                  onClick={() => handleSelectWorkout(workout)}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <Dumbbell className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm leading-snug truncate">{workout.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {workout.exercises.length} exercise
                      {workout.exercises.length !== 1 ? "s" : ""} &middot; ~
                      {workout.estimatedDuration} min
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          /* ── Step 2: Frequency options ── */
          <div className="space-y-5">
            {/* Selected workout chip */}
            {selectedWorkout && (
              <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5">
                <Dumbbell className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm font-medium truncate">{selectedWorkout.name}</p>
              </div>
            )}

            {/* Frequency toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 transition-all ${
                  frequency === "once"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-muted-foreground/50"
                }`}
                onClick={() => setFrequency("once")}
              >
                <Calendar className="h-5 w-5" />
                <span className="text-xs font-medium">One time</span>
              </button>
              <button
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 transition-all ${
                  frequency === "recurring"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-muted-foreground/50"
                }`}
                onClick={() => setFrequency("recurring")}
              >
                <Repeat className="h-5 w-5" />
                <span className="text-xs font-medium">Recurring</span>
              </button>
            </div>

            {/* One time — date input */}
            {frequency === "once" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            )}

            {/* Recurring — day-of-week checkboxes */}
            {frequency === "recurring" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Days of the week</label>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS.map((day, i) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(i)}
                      className={`h-9 w-11 rounded-lg text-xs font-semibold border-2 transition-all ${
                        daysOfWeek.includes(i)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={!canSubmit || saving}>
              {saving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1.5" /> Schedule
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
