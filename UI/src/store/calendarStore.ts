import { create } from "zustand"
import type { WorkoutSchedule, CalendarEvent } from "@/types"
import {
  getSchedules as serverGetSchedules,
  createSchedule as serverCreateSchedule,
  deleteSchedule as serverDeleteSchedule,
} from "@/lib/serverComm"

function deriveEventsForMonth(
  schedules: WorkoutSchedule[],
  year: number,
  month: number,
): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (const s of schedules) {
    if (s.frequency === "once" && s.date) {
      const [y, m] = s.date.split("-").map(Number)
      if (y === year && m - 1 === month) {
        events.push({
          id: `evt-${s.id}`,
          date: s.date,
          type: "workout",
          title: s.workoutName,
          referenceId: s.workoutId,
          color: "#3b82f6",
          scheduleId: s.id,
        })
      }
    } else if (s.frequency === "recurring" && s.daysOfWeek && s.daysOfWeek.length > 0) {
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        if (s.daysOfWeek.includes(date.getDay())) {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          events.push({
            id: `evt-${s.id}-${dateStr}`,
            date: dateStr,
            type: "workout",
            title: s.workoutName,
            referenceId: s.workoutId,
            color: "#3b82f6",
            scheduleId: s.id,
          })
        }
      }
    }
  }

  return events
}

interface CalendarState {
  schedules: WorkoutSchedule[]
  loading: boolean

  loadSchedules: () => Promise<void>
  addSchedule: (data: Omit<WorkoutSchedule, "id" | "createdAt">) => Promise<void>
  removeSchedule: (id: string) => Promise<void>
  getEventsForMonth: (year: number, month: number) => CalendarEvent[]
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  schedules: [],
  loading: false,

  loadSchedules: async () => {
    set({ loading: true })
    try {
      const schedules = await serverGetSchedules()
      set({ schedules })
    } catch {
      // leave existing schedules in place on error
    } finally {
      set({ loading: false })
    }
  },

  addSchedule: async (data) => {
    const schedule: WorkoutSchedule = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ schedules: [...state.schedules, schedule] }))
    try {
      const saved = await serverCreateSchedule(schedule)
      set((state) => ({
        schedules: state.schedules.map((s) => (s.id === schedule.id ? saved : s)),
      }))
    } catch (e) {
      set((state) => ({ schedules: state.schedules.filter((s) => s.id !== schedule.id) }))
      throw e
    }
  },

  removeSchedule: async (id) => {
    const prev = get().schedules
    set((state) => ({ schedules: state.schedules.filter((s) => s.id !== id) }))
    try {
      await serverDeleteSchedule(id)
    } catch (e) {
      set({ schedules: prev })
      throw e
    }
  },

  getEventsForMonth: (year, month) => {
    return deriveEventsForMonth(get().schedules, year, month)
  },
}))
