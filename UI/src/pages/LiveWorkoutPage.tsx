import { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  SkipForward,
  Flag,
  Clock,
  Timer,
  Dumbbell,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWorkoutStore } from "@/store/workoutStore"
import { useSessionStore, type ActiveExercise } from "@/store/sessionStore"
import { cn } from "@/lib/utils"
import type { WorkoutSession } from "@/types"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function useElapsedTimer(startTime: string | null): number {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!startTime) return
    const tick = () => setElapsed(Math.round((Date.now() - new Date(startTime).getTime()) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startTime])
  return elapsed
}

function isExerciseDone(ex: ActiveExercise): boolean {
  return ex.sets.every((s) => s.status !== "pending")
}

// ─── Rest Timer ───────────────────────────────────────────────────────────────

const REST_SECONDS = 90

function RestTimer({ onDismiss }: { onDismiss: () => void }) {
  const [remaining, setRemaining] = useState(REST_SECONDS)

  useEffect(() => {
    if (remaining <= 0) {
      onDismiss()
      return
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(id)
  }, [remaining, onDismiss])

  const radius = 18
  const circumference = 2 * Math.PI * radius
  const progress = (remaining / REST_SECONDS) * circumference

  return (
    <div className="fixed bottom-20 md:bottom-6 inset-x-4 md:inset-x-auto md:right-6 md:left-auto md:w-80 z-40">
      <Card className="shadow-lg border-primary/20 bg-card">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44" width="56" height="56">
              <circle cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
              <circle
                cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="3"
                className="text-primary transition-all duration-1000"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
              />
            </svg>
            <span className="relative text-sm font-mono font-bold">{remaining}s</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 text-primary" /> Rest time
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Take a breather before your next set</p>
          </div>
          <Button size="sm" variant="outline" onClick={onDismiss} className="shrink-0">
            Skip
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Completion Screen ─────────────────────────────────────────────────────────

function CompletionScreen({ session }: { session: WorkoutSession }) {
  const navigate = useNavigate()

  const totalSets = session.exercises.reduce((t, ex) => t + ex.sets.length, 0)
  const completedSets = session.exercises.reduce((t, ex) => t + ex.sets.filter((s) => !s.skipped).length, 0)

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 gap-6 max-w-md mx-auto">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
        <Flag className="h-10 w-10 text-emerald-600" />
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold">Workout Complete!</h1>
        <p className="text-muted-foreground mt-2 text-sm">{session.workoutName}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {[
          { label: "Duration", value: formatTime(session.elapsedSeconds), icon: Clock },
          { label: "Sets Done", value: `${completedSets}/${totalSets}`, icon: Dumbbell },
          { label: "Volume", value: session.totalVolume >= 1000 ? `${(session.totalVolume / 1000).toFixed(1)}t` : `${session.totalVolume}kg`, icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-3 text-center">
              <Icon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-bold leading-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exercise breakdown */}
      <Card className="w-full">
        <CardContent className="p-4 divide-y">
          {session.exercises.map((ex) => {
            const done = ex.sets.filter((s) => !s.skipped).length
            const total = ex.sets.length
            const vol = ex.sets.reduce((t, s) => (s.skipped ? t : t + s.actualReps * s.actualWeight), 0)
            return (
              <div key={ex.exerciseId} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{ex.exerciseName}</p>
                  <p className="text-xs text-muted-foreground">{done}/{total} sets</p>
                </div>
                {vol > 0 && (
                  <p className="text-sm font-semibold text-muted-foreground">{vol.toLocaleString()} kg</p>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="flex gap-3 w-full">
        <Button variant="outline" className="flex-1" onClick={() => navigate("/workout-planner")}>
          Planner
        </Button>
        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate("/dashboard")}>
          Dashboard
        </Button>
      </div>
    </div>
  )
}

// ─── Number Stepper ───────────────────────────────────────────────────────────

function Stepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">
        {label}
      </label>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0 text-lg"
          onClick={() => onChange(Math.max(min, value - step))}
        >
          −
        </Button>
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value)
            if (!isNaN(v)) onChange(Math.max(min, v))
          }}
          className="flex-1 text-center text-2xl font-bold h-11 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring min-w-0"
        />
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0 text-lg"
          onClick={() => onChange(value + step)}
        >
          +
        </Button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LiveWorkoutPage() {
  const { workoutId } = useParams<{ workoutId: string }>()
  const navigate = useNavigate()
  const { workouts } = useWorkoutStore()
  const { activeSession, startSession, logSet, skipSet, goToExercise, goToSet, finishSession, cancelSession } =
    useSessionStore()

  const [localReps, setLocalReps] = useState(0)
  const [localWeight, setLocalWeight] = useState(0)
  const [showRestTimer, setShowRestTimer] = useState(false)
  const [completedSession, setCompletedSession] = useState<WorkoutSession | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const elapsed = useElapsedTimer(activeSession?.startTime ?? null)

  // Start or resume session when page mounts
  useEffect(() => {
    if (!workoutId) {
      navigate("/workout-planner", { replace: true })
      return
    }
    const workout = workouts.find((w) => w.id === workoutId)
    if (!workout) {
      navigate("/workout-planner", { replace: true })
      return
    }
    if (!activeSession || activeSession.workoutId !== workoutId) {
      startSession(workout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workoutId])

  // Sync input fields with the current active set
  useEffect(() => {
    if (!activeSession) return
    const ex = activeSession.exercises[activeSession.currentExerciseIdx]
    const s = ex?.sets[activeSession.currentSetIdx]
    if (!s) return
    setLocalReps(s.status === "pending" ? s.targetReps : s.actualReps)
    setLocalWeight(s.status === "pending" ? s.targetWeight : s.actualWeight)
  }, [activeSession?.currentExerciseIdx, activeSession?.currentSetIdx, activeSession?.workoutId])

  const handleDismissRest = useCallback(() => setShowRestTimer(false), [])

  if (completedSession) return <CompletionScreen session={completedSession} />
  if (!activeSession) return null

  const { exercises, currentExerciseIdx, currentSetIdx } = activeSession
  const currentExercise = exercises[currentExerciseIdx]
  const currentSet = currentExercise?.sets[currentSetIdx]
  const isBodyweight = currentExercise?.weightUnit === "bodyweight"
  const isCurrentSetPending = currentSet?.status === "pending"
  const currentExerciseDone = isExerciseDone(currentExercise)
  const allDone = exercises.every(isExerciseDone)
  const doneCount = exercises.filter(isExerciseDone).length

  const weightStep = currentExercise?.weightUnit === "lb" ? 5 : 2.5

  function handleLogSet() {
    logSet(localReps, isBodyweight ? 0 : localWeight)
    setShowRestTimer(true)
  }

  function handleSkip() {
    skipSet()
  }

  function handleFinish() {
    const session = finishSession()
    if (session) setCompletedSession(session)
  }

  function handleCancel() {
    cancelSession()
    navigate("/workout-planner")
  }

  return (
    <div className="flex flex-col">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => setShowCancelDialog(true)}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{activeSession.workoutName}</p>
            <p className="text-xs text-muted-foreground">
              {doneCount}/{exercises.length} exercises done
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 font-mono text-sm font-semibold tabular-nums">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {formatTime(elapsed)}
          </div>
        </div>

        {/* Exercise progress dots */}
        <div className="flex items-center justify-center gap-1.5 pb-2.5 px-4 overflow-x-auto">
          {exercises.map((ex, i) => (
            <button
              key={i}
              onClick={() => goToExercise(i)}
              title={ex.exerciseName}
              className={cn(
                "rounded-full transition-all shrink-0",
                i === currentExerciseIdx
                  ? "h-2.5 w-6 bg-primary"
                  : isExerciseDone(ex)
                  ? "h-2 w-2 bg-primary/50"
                  : "h-2 w-2 bg-muted-foreground/25 hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="p-4 max-w-2xl mx-auto w-full space-y-4 pb-36">

        {/* Exercise navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            disabled={currentExerciseIdx === 0}
            onClick={() => goToExercise(currentExerciseIdx - 1)}
            className="shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">
              Exercise {currentExerciseIdx + 1} of {exercises.length}
            </p>
            <h2 className="text-xl font-bold leading-tight">{currentExercise.exerciseName}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Badge variant="secondary">{currentExercise.muscleGroup}</Badge>
              {currentExercise.weightUnit === "bodyweight" && (
                <Badge variant="outline" className="text-xs">Bodyweight</Badge>
              )}
            </div>
            {currentExercise.notes && (
              <p className="text-xs text-muted-foreground mt-1 italic">"{currentExercise.notes}"</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            disabled={currentExerciseIdx === exercises.length - 1}
            onClick={() => goToExercise(currentExerciseIdx + 1)}
            className="shrink-0"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Sets table */}
        <Card>
          <CardContent className="p-0 divide-y overflow-hidden rounded-xl">
            {/* Header */}
            <div className="grid grid-cols-[2rem_1fr_1fr_5rem] gap-2 px-4 py-2 bg-muted/40 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <span>#</span>
              <span>Target</span>
              <span>Actual</span>
              <span className="text-right">Status</span>
            </div>

            {currentExercise.sets.map((s, i) => {
              const isActive = i === currentSetIdx && s.status === "pending"
              const isDone = s.status === "completed"
              const isSkipped = s.status === "skipped"

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (s.status !== "completed") goToSet(currentExerciseIdx, i)
                  }}
                  className={cn(
                    "grid grid-cols-[2rem_1fr_1fr_5rem] gap-2 px-4 py-3 w-full text-left transition-colors",
                    isActive && "bg-primary/8",
                    !isDone && !isActive && "hover:bg-muted/40 cursor-pointer",
                    isDone && "cursor-default",
                  )}
                >
                  {/* Set number */}
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                      isDone && "bg-emerald-500 text-white",
                      isSkipped && "bg-muted text-muted-foreground line-through",
                      isActive && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-1",
                      !isDone && !isSkipped && !isActive && "bg-muted/60 text-muted-foreground",
                    )}
                  >
                    {isDone ? <Check className="h-3 w-3" /> : s.setNumber}
                  </div>

                  {/* Target */}
                  <div className="text-sm self-center">
                    <span className={cn(isActive ? "font-medium" : "text-muted-foreground")}>
                      {s.targetReps} reps
                      {!isBodyweight && s.targetWeight > 0 && ` @ ${s.targetWeight} kg`}
                    </span>
                  </div>

                  {/* Actual */}
                  <div className="text-sm self-center">
                    {isDone && (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {s.actualReps} reps
                        {!isBodyweight && s.actualWeight > 0 && ` @ ${s.actualWeight} kg`}
                      </span>
                    )}
                    {isSkipped && <span className="text-muted-foreground/60 italic text-xs">skipped</span>}
                    {s.status === "pending" && !isActive && (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                    {isActive && <span className="text-primary/70 text-xs font-medium">logging…</span>}
                  </div>

                  {/* Status badge */}
                  <div className="text-right self-center">
                    {isDone && <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Done</span>}
                    {isSkipped && <span className="text-xs text-muted-foreground">Skipped</span>}
                    {isActive && <span className="text-xs font-medium text-primary">Active</span>}
                    {s.status === "pending" && !isActive && (
                      <span className="text-xs text-muted-foreground/40">Pending</span>
                    )}
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* ── Input form (only when current set is pending) ── */}
        {isCurrentSetPending && (
          <Card className="border-primary/20">
            <CardContent className="p-4 space-y-4">
              <p className="text-xs text-center font-medium text-muted-foreground uppercase tracking-wide">
                Set {currentSet.setNumber} — Log your performance
              </p>
              <div className={cn("grid gap-4", isBodyweight ? "grid-cols-1 max-w-40 mx-auto" : "grid-cols-2")}>
                <Stepper label="Reps" value={localReps} onChange={setLocalReps} step={1} min={0} />
                {!isBodyweight && (
                  <Stepper
                    label={`Weight (${currentExercise.weightUnit})`}
                    value={localWeight}
                    onChange={setLocalWeight}
                    step={weightStep}
                    min={0}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Action buttons ── */}
        {isCurrentSetPending ? (
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleSkip}>
              <SkipForward className="h-4 w-4 mr-2" />
              Skip Set
            </Button>
            <Button
              className="flex-1 bg-primary"
              onClick={handleLogSet}
              disabled={localReps === 0}
            >
              <Check className="h-4 w-4 mr-2" />
              Log Set
            </Button>
          </div>
        ) : currentExerciseDone ? (
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-3 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
            <Check className="h-4 w-4 shrink-0" />
            All sets complete for this exercise!
          </div>
        ) : null}

        {/* ── Exercise navigation + Finish ── */}
        <div className="flex gap-3 pt-1">
          <Button
            variant="outline"
            className="flex-1"
            disabled={currentExerciseIdx === 0}
            onClick={() => goToExercise(currentExerciseIdx - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          {currentExerciseIdx < exercises.length - 1 ? (
            <Button
              className="flex-1"
              onClick={() => goToExercise(currentExerciseIdx + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={handleFinish}
            >
              <Flag className="h-4 w-4 mr-1.5" />
              Finish
            </Button>
          )}
        </div>

        {/* Finish button when all exercises are done */}
        {allDone && (
          <Button
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-700 font-semibold"
            onClick={handleFinish}
          >
            <Flag className="h-5 w-5 mr-2" />
            Finish Workout
          </Button>
        )}
      </div>

      {/* ── Rest timer overlay ── */}
      {showRestTimer && <RestTimer onDismiss={handleDismissRest} />}

      {/* ── Cancel confirm dialog ── */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-sm shadow-xl">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-lg">Cancel workout?</h3>
              <p className="text-sm text-muted-foreground">
                Your progress for this session will be lost. This can't be undone.
              </p>
              <div className="flex gap-3 pt-1">
                <Button variant="outline" className="flex-1" onClick={() => setShowCancelDialog(false)}>
                  Keep going
                </Button>
                <Button variant="destructive" className="flex-1" onClick={handleCancel}>
                  Cancel workout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
