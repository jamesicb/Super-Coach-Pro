import { useState, useMemo } from "react"
import { Search, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EXERCISE_LIBRARY, MUSCLE_GROUPS, type ExerciseTemplate } from "@/mock/exercises"

interface ExerciseSearchModalProps {
  open: boolean
  onClose: () => void
  onSelect: (exercise: ExerciseTemplate) => void
  alreadyAdded?: string[]
}

const muscleGroupColors: Record<string, string> = {
  Chest:     "bg-blue-100 text-blue-700",
  Back:      "bg-emerald-100 text-emerald-700",
  Legs:      "bg-orange-100 text-orange-700",
  Shoulders: "bg-purple-100 text-purple-700",
  Arms:      "bg-pink-100 text-pink-700",
  Core:      "bg-yellow-100 text-yellow-700",
}

export default function ExerciseSearchModal({ open, onClose, onSelect, alreadyAdded = [] }: ExerciseSearchModalProps) {
  const [query, setQuery] = useState("")
  const [muscleFilter, setMuscleFilter] = useState("all")

  const filtered = useMemo(() => {
    return EXERCISE_LIBRARY.filter((ex) => {
      const matchesQuery = ex.name.toLowerCase().includes(query.toLowerCase()) ||
        ex.muscleGroup.toLowerCase().includes(query.toLowerCase())
      const matchesMuscle = muscleFilter === "all" || ex.muscleGroup === muscleFilter
      return matchesQuery && matchesMuscle
    })
  }, [query, muscleFilter])

  function handleSelect(ex: ExerciseTemplate) {
    onSelect(ex)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] flex flex-col gap-0 p-0">
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
          <Select value={muscleFilter} onValueChange={setMuscleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All muscle groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All muscle groups</SelectItem>
              {MUSCLE_GROUPS.map((mg) => (
                <SelectItem key={mg} value={mg}>{mg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-4 space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p className="text-sm">No exercises found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              filtered.map((ex) => {
                const isAdded = alreadyAdded.includes(ex.name)
                const color = muscleGroupColors[ex.muscleGroup] ?? "bg-gray-100 text-gray-700"
                return (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{ex.name}</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
                          {ex.muscleGroup}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{ex.equipment} · {ex.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={isAdded ? "secondary" : "default"}
                      className="ml-3 shrink-0 h-8"
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
