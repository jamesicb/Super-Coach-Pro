import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCalendarStore } from "@/store/calendarStore"
import { useToast } from "@/hooks/use-toast"
import ScheduleWorkoutDialog from "@/components/calendar/ScheduleWorkoutDialog"
import type { CalendarEvent } from "@/types"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function buildGrid(year: number, month: number) {
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year

  const cells: Array<{ date: string; day: number; current: boolean }> = []

  for (let i = firstDow - 1; i >= 0; i--) {
    const d = daysInPrev - i
    cells.push({ date: toDateStr(prevYear, prevMonth, d), day: d, current: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: toDateStr(year, month, d), day: d, current: true })
  }
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ date: toDateStr(nextYear, nextMonth, d), day: d, current: false })
  }

  return cells
}

// ─── Event pill ──────────────────────────────────────────────────────────────

function EventPill({
  event,
  active,
  onClick,
}: {
  event: CalendarEvent
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded px-1.5 py-0.5 text-[10px] font-medium truncate transition-all leading-4 ${
        active ? "ring-1 ring-offset-0 opacity-100" : "hover:opacity-80"
      }`}
      style={{
        backgroundColor: event.color ? `${event.color}22` : "#3b82f622",
        color: event.color ?? "#3b82f6",
        ringColor: event.color ?? "#3b82f6",
      }}
    >
      {event.title}
    </button>
  )
}

// ─── Event popover ───────────────────────────────────────────────────────────

function EventPopover({
  event,
  onClose,
  onRemove,
  onStart,
  removing,
}: {
  event: CalendarEvent
  onClose: () => void
  onRemove: () => void
  onStart: () => void
  removing: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute z-30 top-full left-0 mt-1 w-56 rounded-xl border border-border bg-popover shadow-xl p-3 space-y-2.5"
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <p className="text-xs font-semibold leading-snug">{event.title}</p>
        <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{event.type}</p>
      </div>
      {event.type === "workout" && (
        <Button
          size="sm"
          className="w-full h-7 text-xs gap-1.5"
          onClick={onStart}
        >
          <Play className="h-3 w-3" />
          Start Workout
        </Button>
      )}
      {event.scheduleId && (
        <Button
          variant="destructive"
          size="sm"
          className="w-full h-7 text-xs gap-1.5"
          onClick={onRemove}
          disabled={removing}
        >
          {removing ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Trash2 className="h-3 w-3" />
          )}
          Remove Schedule
        </Button>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const now = new Date()
  const navigate = useNavigate()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [activeEventId, setActiveEventId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const { schedules, getEventsForMonth, removeSchedule, loadSchedules, loading } = useCalendarStore()
  const { toast } = useToast()

  useEffect(() => {
    loadSchedules()
  }, [loadSchedules])

  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate())

  const cells = useMemo(() => buildGrid(year, month), [year, month])
  const events = useMemo(() => getEventsForMonth(year, month), [getEventsForMonth, year, month, schedules])

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const evt of events) {
      const list = map.get(evt.date) ?? []
      list.push(evt)
      map.set(evt.date, list)
    }
    return map
  }, [events])

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  function goToday() {
    setYear(now.getFullYear())
    setMonth(now.getMonth())
  }

  const activeEvent = activeEventId
    ? events.find((e) => e.id === activeEventId) ?? null
    : null

  async function handleRemoveSchedule(event: CalendarEvent) {
    if (!event.scheduleId) return
    setRemovingId(event.scheduleId)
    try {
      await removeSchedule(event.scheduleId)
      toast({ title: "Schedule removed", description: `"${event.title}" has been unscheduled.` })
      setActiveEventId(null)
    } catch {
      toast({ title: "Error", description: "Failed to remove schedule.", variant: "destructive" })
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* ── Page header ── */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <CalendarDays className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Calendar</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Schedule and track your workout routine.
            </p>
          </div>
        </div>
        <Button onClick={() => setScheduleOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" /> Schedule Workout
        </Button>
      </div>

      {/* ── Calendar card ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">

        {/* Month navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="rounded-lg p-1.5 hover:bg-muted transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextMonth}
              className="rounded-lg p-1.5 hover:bg-muted transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">
              {MONTH_NAMES[month]} {year}
            </h3>
            {loading && <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToday}
            className="text-xs h-8"
          >
            Today
          </Button>
        </div>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {DAY_NAMES.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7">
          {cells.map((cell, idx) => {
            const cellEvents = eventsByDate.get(cell.date) ?? []
            const isToday = cell.date === todayStr
            const isLastRow = idx >= 35

            return (
              <div
                key={cell.date}
                className={[
                  "relative min-h-[96px] p-2 border-b border-r border-border",
                  !cell.current ? "bg-muted/20" : "",
                  isLastRow ? "border-b-0" : "",
                  (idx + 1) % 7 === 0 ? "border-r-0" : "",
                ].join(" ")}
              >
                {/* Day number */}
                <span
                  className={[
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium mb-1",
                    isToday
                      ? "bg-primary text-primary-foreground font-bold"
                      : cell.current
                      ? "text-foreground"
                      : "text-muted-foreground/40",
                  ].join(" ")}
                >
                  {cell.day}
                </span>

                {/* Events */}
                <div className="flex flex-col gap-0.5">
                  {cellEvents.slice(0, 3).map((evt) => (
                    <EventPill
                      key={evt.id}
                      event={evt}
                      active={activeEventId === evt.id}
                      onClick={() =>
                        setActiveEventId((prev) => (prev === evt.id ? null : evt.id))
                      }
                    />
                  ))}
                  {cellEvents.length > 3 && (
                    <span className="text-[10px] text-muted-foreground pl-1">
                      +{cellEvents.length - 3} more
                    </span>
                  )}
                </div>

                {/* Popover for active event */}
                {activeEvent && cellEvents.some((e) => e.id === activeEvent.id) && (
                  <EventPopover
                    event={activeEvent}
                    onClose={() => setActiveEventId(null)}
                    onRemove={() => handleRemoveSchedule(activeEvent)}
                    onStart={() => navigate(`/live-workout/${activeEvent.referenceId}`)}
                    removing={removingId === activeEvent.scheduleId}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <ScheduleWorkoutDialog open={scheduleOpen} onOpenChange={setScheduleOpen} />
    </div>
  )
}
