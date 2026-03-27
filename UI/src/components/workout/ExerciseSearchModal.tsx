import { useState, useMemo, useEffect } from "react"
import { Search, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getExercises, type ExerciseTemplate } from "@/lib/serverComm"

interface ExerciseSearchModalProps {
  open: boolean
  onClose: () => void
  onSelect: (exercise: ExerciseTemplate) => void
  alreadyAdded?: string[]
}

const muscleGroupColors: Record<string, string> = {
  Chest:      "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  Back:       "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  Legs:       "bg-orange-500/15 text-orange-400 border border-orange-500/25",
  Shoulders:  "bg-purple-500/15 text-purple-400 border border-purple-500/25",
  Arms:       "bg-pink-500/15 text-pink-400 border border-pink-500/25",
  Core:       "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
}

const categoryColors: Record<string, string> = {
  Strength:    "bg-primary/15 text-primary border border-primary/25",
  Cardio:      "bg-red-500/15 text-red-400 border border-red-500/25",
  Flexibility: "bg-teal-500/15 text-teal-400 border border-teal-500/25",
}

export default function ExerciseSearchModal({ open, onClose, onSelect, alreadyAdded = [] }: ExerciseSearchModalProps) {
  const [query, setQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [muscleFilter, setMuscleFilter] = useState("all")
  const [exercises, setExercises] = useState<ExerciseTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    getExercises()
      .then(setExercises)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load exercises"),
      )
      .finally(() => setLoading(false))
  }, [open])

  const categories = useMemo(
    () => [...new Set(exercises.map((e) => e.category))].sort(),
    [exercises],
  )

  const muscleGroups = useMemo(
    () => [...new Set(exercises.map((e) => e.muscleGroup))].sort(),
    [exercises],
  )

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesQuery =
        ex.name.toLowerCase().includes(query.toLowerCase()) ||
        ex.muscleGroup.toLowerCase().includes(query.toLowerCase()) ||
        ex.category.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = categoryFilter === "all" || ex.category === categoryFilter
      const matchesMuscle = muscleFilter === "all" || ex.muscleGroup === muscleFilter
      return matchesQuery && matchesCategory && matchesMuscle
    })
  }, [exercises, query, categoryFilter, muscleFilter])

  function handleSelect(ex: ExerciseTemplate) {
    onSelect(ex)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Add Exercise</DialogTitle>
          <DialogDescription>Search and add exercises to your workout</DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="px-6 pb-4 space-y-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={muscleFilter} onValueChange={setMuscleFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Muscle Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Muscle Groups</SelectItem>
                {muscleGroups.map((mg) => (
                  <SelectItem key={mg} value={mg}>{mg}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Column headers */}
        <div className="px-6 pt-3 pb-2 grid grid-cols-[1fr_100px_110px_100px_auto] gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30 border-b border-border">
          <span className="py-1">Exercise</span>
          <span className="py-1">Category</span>
          <span className="py-1">Muscle Group</span>
          <span className="py-1">Equipment</span>
          <span />
        </div>

        {/* Results */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-4 py-2 space-y-0.5">
            {loading ? (
              <div className="text-center py-10 text-muted-foreground">
                <p className="text-sm">Loading exercises…</p>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-destructive">
                <p className="text-sm">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p className="text-sm">No exercises found</p>
                <p className="text-xs mt-1">Try a different search term or filter</p>
              </div>
            ) : (
              filtered.map((ex) => {
                const isAdded = alreadyAdded.includes(ex.name)
                const mgColor = muscleGroupColors[ex.muscleGroup] ?? "bg-muted text-muted-foreground border border-border"
                const catColor = categoryColors[ex.category] ?? "bg-muted text-muted-foreground border border-border"
                return (
                  <div
                    key={ex.id}
                    className="grid grid-cols-[1fr_100px_110px_100px_auto] gap-2 items-center py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    {/* Exercise name + description */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight text-foreground">{ex.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{ex.description}</p>
                    </div>

                    {/* Category */}
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium w-fit ${catColor}`}>
                      {ex.category}
                    </span>

                    {/* Muscle group */}
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium w-fit ${mgColor}`}>
                      {ex.muscleGroup}
                    </span>

                    {/* Equipment */}
                    <span className="text-xs text-muted-foreground">{ex.equipment}</span>

                    {/* Action */}
                    <Button
                      size="sm"
                      variant={isAdded ? "secondary" : "default"}
                      className="h-7 shrink-0 text-xs"
                      onClick={() => !isAdded && handleSelect(ex)}
                      disabled={isAdded}
                    >
                      {isAdded ? "Added" : <><Plus className="h-3 w-3 mr-1" /> Add</>}
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
