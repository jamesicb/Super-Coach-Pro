import { create } from "zustand"
import type { Workout, WorkoutSession, SessionExercise, LoggedSet, WeightUnit } from "@/types"
import { MOCK_SESSIONS } from "@/mock/sessions"

let idCounter = 3000
function genId() {
  return `sess-${Date.now()}-${++idCounter}`
}

export type SetStatus = "pending" | "completed" | "skipped"

export interface ActiveSet {
  setNumber: number
  targetReps: number
  targetWeight: number
  actualReps: number
  actualWeight: number
  status: SetStatus
}

export interface ActiveExercise {
  exerciseId: string
  exerciseName: string
  muscleGroup: string
  weightUnit: WeightUnit
  notes?: string
  sets: ActiveSet[]
}

export interface ActiveSession {
  workoutId: string
  workoutName: string
  startTime: string
  exercises: ActiveExercise[]
  currentExerciseIdx: number
  currentSetIdx: number
}

interface SessionState {
  sessions: WorkoutSession[]
  activeSession: ActiveSession | null

  startSession: (workout: Workout) => void
  logSet: (actualReps: number, actualWeight: number) => void
  skipSet: () => void
  goToExercise: (exerciseIdx: number) => void
  goToSet: (exerciseIdx: number, setIdx: number) => void
  finishSession: () => WorkoutSession | null
  cancelSession: () => void
}

function findNextPendingSet(
  exercises: ActiveExercise[],
  exerciseIdx: number,
  afterSetIdx: number,
): { exerciseIdx: number; setIdx: number } | null {
  // Look in the same exercise first
  const ex = exercises[exerciseIdx]
  for (let i = afterSetIdx + 1; i < ex.sets.length; i++) {
    if (ex.sets[i].status === "pending") return { exerciseIdx, setIdx: i }
  }
  return null
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: MOCK_SESSIONS,
  activeSession: null,

  startSession: (workout) => {
    const exercises: ActiveExercise[] = workout.exercises.map((ex) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      muscleGroup: ex.muscleGroup,
      weightUnit: ex.weightUnit,
      notes: ex.notes,
      sets: ex.sets.map((s, i) => ({
        setNumber: i + 1,
        targetReps: s.reps,
        targetWeight: s.weight,
        actualReps: s.reps,
        actualWeight: s.weight,
        status: "pending" as SetStatus,
      })),
    }))

    set({
      activeSession: {
        workoutId: workout.id,
        workoutName: workout.name,
        startTime: new Date().toISOString(),
        exercises,
        currentExerciseIdx: 0,
        currentSetIdx: 0,
      },
    })
  },

  logSet: (actualReps, actualWeight) => {
    const { activeSession } = get()
    if (!activeSession) return
    const { currentExerciseIdx, currentSetIdx } = activeSession

    const exercises = activeSession.exercises.map((ex, ei) => {
      if (ei !== currentExerciseIdx) return ex
      return {
        ...ex,
        sets: ex.sets.map((s, si) =>
          si !== currentSetIdx ? s : { ...s, actualReps, actualWeight, status: "completed" as SetStatus },
        ),
      }
    })

    const next = findNextPendingSet(exercises, currentExerciseIdx, currentSetIdx)
    set({
      activeSession: {
        ...activeSession,
        exercises,
        currentSetIdx: next ? next.setIdx : currentSetIdx,
      },
    })
  },

  skipSet: () => {
    const { activeSession } = get()
    if (!activeSession) return
    const { currentExerciseIdx, currentSetIdx } = activeSession

    const exercises = activeSession.exercises.map((ex, ei) => {
      if (ei !== currentExerciseIdx) return ex
      return {
        ...ex,
        sets: ex.sets.map((s, si) =>
          si !== currentSetIdx ? s : { ...s, status: "skipped" as SetStatus },
        ),
      }
    })

    const next = findNextPendingSet(exercises, currentExerciseIdx, currentSetIdx)
    set({
      activeSession: {
        ...activeSession,
        exercises,
        currentSetIdx: next ? next.setIdx : currentSetIdx,
      },
    })
  },

  goToExercise: (exerciseIdx) => {
    const { activeSession } = get()
    if (!activeSession) return
    const ex = activeSession.exercises[exerciseIdx]
    if (!ex) return
    const firstPending = ex.sets.findIndex((s) => s.status === "pending")
    set({
      activeSession: {
        ...activeSession,
        currentExerciseIdx: exerciseIdx,
        currentSetIdx: firstPending >= 0 ? firstPending : ex.sets.length - 1,
      },
    })
  },

  goToSet: (exerciseIdx, setIdx) => {
    const { activeSession } = get()
    if (!activeSession) return
    set({
      activeSession: {
        ...activeSession,
        currentExerciseIdx: exerciseIdx,
        currentSetIdx: setIdx,
      },
    })
  },

  finishSession: () => {
    const { activeSession, sessions } = get()
    if (!activeSession) return null

    const endTime = new Date().toISOString()
    const elapsed = Math.round(
      (new Date(endTime).getTime() - new Date(activeSession.startTime).getTime()) / 1000,
    )

    const sessionExercises: SessionExercise[] = activeSession.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      muscleGroup: ex.muscleGroup,
      sets: ex.sets.map(
        (s): LoggedSet => ({
          setNumber: s.setNumber,
          targetReps: s.targetReps,
          targetWeight: s.targetWeight,
          actualReps: s.actualReps,
          actualWeight: s.actualWeight,
          skipped: s.status === "skipped",
        }),
      ),
    }))

    const totalVolume = sessionExercises.reduce(
      (total, ex) =>
        total +
        ex.sets.reduce((t, s) => (s.skipped ? t : t + s.actualReps * s.actualWeight), 0),
      0,
    )

    const session: WorkoutSession = {
      id: genId(),
      workoutId: activeSession.workoutId,
      workoutName: activeSession.workoutName,
      date: new Date().toISOString().split("T")[0],
      startTime: activeSession.startTime,
      endTime,
      elapsedSeconds: elapsed,
      exercises: sessionExercises,
      totalVolume,
    }

    set({ sessions: [session, ...sessions], activeSession: null })
    return session
  },

  cancelSession: () => {
    set({ activeSession: null })
  },
}))
