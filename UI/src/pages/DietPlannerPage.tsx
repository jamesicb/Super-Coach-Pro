import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Pencil, Trash2, MoreVertical, Search, UtensilsCrossed, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDietStore } from "@/store/dietStore"
import { useToast } from "@/hooks/use-toast"
import type { MealPlan } from "@/types"

// ─── Diet plan card ───────────────────────────────────────────────────────────

function PlanCard({ plan, onDelete }: { plan: MealPlan; onDelete: (id: string) => void }) {
  const navigate = useNavigate()
  const mealCount = plan.meals.length

  return (
    <div
      className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
      onClick={() => navigate(`/diet-planner/${plan.id}/edit`)}
    >
      {/* Left: name + summary */}
      <div className="min-w-0 space-y-1.5">
        <p className="font-semibold text-base leading-snug truncate">{plan.name}</p>
        <p className="text-sm text-muted-foreground">
          {mealCount} meal{mealCount !== 1 ? "s" : ""} &middot; {plan.targetCalories} kcal/day
        </p>
        {/* Macro pills */}
        <div className="flex gap-2">
          <span className="rounded-full bg-blue-100 text-blue-700 text-xs px-2 py-0.5 font-medium">
            P {plan.targetProtein}g
          </span>
          <span className="rounded-full bg-amber-100 text-amber-700 text-xs px-2 py-0.5 font-medium">
            C {plan.targetCarbs}g
          </span>
          <span className="rounded-full bg-rose-100 text-rose-700 text-xs px-2 py-0.5 font-medium">
            F {plan.targetFat}g
          </span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/diet-planner/${plan.id}/edit`} onClick={(e) => e.stopPropagation()}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => { e.stopPropagation(); onDelete(plan.id) }}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DietPlannerPage() {
  const { plans, deletePlan, syncing } = useDietStore()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<MealPlan | null>(null)

  const filtered = plans.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  function handleDelete(id: string) {
    const plan = plans.find((p) => p.id === id)
    if (plan) setDeleteTarget(plan)
  }

  function confirmDelete() {
    if (!deleteTarget) return
    deletePlan(deleteTarget.id)
    toast({ title: "Diet plan deleted", description: `"${deleteTarget.name}" has been removed.` })
    setDeleteTarget(null)
  }

  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">

      {/* ── Diet Planner header ── */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Diet Planner</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Create and manage your daily nutrition plans.
            </p>
          </div>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/diet-planner/create">
            <Plus className="h-4 w-4 mr-2" /> Create Diet Plan
          </Link>
        </Button>
      </div>

      {/* ── My Diet Plans section ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">My Diet Plans</h3>
          {plans.length > 0 && (
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {plans.length}
            </span>
          )}
        </div>

        {/* Search */}
        {plans.length > 0 && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search diet plans…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* Loading state */}
        {syncing ? (
          <div className="flex items-center gap-3 py-8 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="text-sm">Loading your diet plans…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center space-y-3">
            {search ? (
              <>
                <p className="font-medium">No plans match "{search}"</p>
                <p className="text-sm text-muted-foreground">Try a different search term</p>
              </>
            ) : (
              <>
                <UtensilsCrossed className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="font-medium text-muted-foreground">No diet plans yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your first plan and it will appear here.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link to="/diet-planner/create">
                    <Plus className="h-4 w-4 mr-1.5" /> Create Diet Plan
                  </Link>
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Diet Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
