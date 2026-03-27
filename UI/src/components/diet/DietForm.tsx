import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, ChevronDown, ChevronUp, Save, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDietStore } from "@/store/dietStore"
import { useToast } from "@/hooks/use-toast"
import type { MealPlan, Meal, FoodItem } from "@/types"

// ─── Helpers ──────────────────────────────────────────────────────────────────

let idSeq = 0
function genId(prefix: string) {
  return `${prefix}-${Date.now()}-${++idSeq}`
}

function computeMealTotals(items: FoodItem[]): Pick<Meal, "totalCalories" | "totalProtein" | "totalCarbs" | "totalFat"> {
  return items.reduce(
    (acc, item) => ({
      totalCalories: acc.totalCalories + (item.calories || 0),
      totalProtein: acc.totalProtein + (item.protein || 0),
      totalCarbs: acc.totalCarbs + (item.carbs || 0),
      totalFat: acc.totalFat + (item.fat || 0),
    }),
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
  )
}

const MEAL_TYPE_LABELS: Record<Meal["type"], string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
}

const MEAL_TYPE_COLORS: Record<Meal["type"], string> = {
  breakfast: "bg-amber-100 text-amber-700",
  lunch: "bg-emerald-100 text-emerald-700",
  dinner: "bg-blue-100 text-blue-700",
  snack: "bg-purple-100 text-purple-700",
}

// ─── Add Food Form ─────────────────────────────────────────────────────────────

interface FoodDraft {
  name: string
  servingSize: string
  calories: string
  protein: string
  carbs: string
  fat: string
}

const emptyDraft = (): FoodDraft => ({ name: "", servingSize: "", calories: "", protein: "", carbs: "", fat: "" })

interface AddFoodFormProps {
  onAdd: (food: FoodItem) => void
  onCancel: () => void
}

function AddFoodForm({ onAdd, onCancel }: AddFoodFormProps) {
  const [draft, setDraft] = useState<FoodDraft>(emptyDraft())

  function field(key: keyof FoodDraft) {
    return {
      value: draft[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDraft((d) => ({ ...d, [key]: e.target.value })),
    }
  }

  function handleAdd() {
    if (!draft.name.trim()) return
    onAdd({
      id: genId("food"),
      name: draft.name.trim(),
      servingSize: draft.servingSize.trim() || "1 serving",
      calories: parseFloat(draft.calories) || 0,
      protein: parseFloat(draft.protein) || 0,
      carbs: parseFloat(draft.carbs) || 0,
      fat: parseFloat(draft.fat) || 0,
    })
  }

  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Food name *</Label>
          <Input placeholder="e.g. Chicken breast" className="h-8 text-sm" {...field("name")} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Serving size</Label>
          <Input placeholder="e.g. 100g" className="h-8 text-sm" {...field("servingSize")} />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Calories</Label>
          <Input type="number" min="0" placeholder="0" className="h-8 text-sm" {...field("calories")} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Protein (g)</Label>
          <Input type="number" min="0" placeholder="0" className="h-8 text-sm" {...field("protein")} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Carbs (g)</Label>
          <Input type="number" min="0" placeholder="0" className="h-8 text-sm" {...field("carbs")} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Fat (g)</Label>
          <Input type="number" min="0" placeholder="0" className="h-8 text-sm" {...field("fat")} />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={handleAdd} disabled={!draft.name.trim()}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Food
        </Button>
      </div>
    </div>
  )
}

// ─── Meal Section ─────────────────────────────────────────────────────────────

interface MealSectionProps {
  meal: Meal
  onUpdate: (updated: Meal) => void
  onDelete: () => void
}

function MealSection({ meal, onUpdate, onDelete }: MealSectionProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [showAddFood, setShowAddFood] = useState(false)

  function handleAddFood(food: FoodItem) {
    const items = [...meal.items, food]
    onUpdate({ ...meal, items, ...computeMealTotals(items) })
    setShowAddFood(false)
  }

  function handleRemoveFood(foodId: string) {
    const items = meal.items.filter((f) => f.id !== foodId)
    onUpdate({ ...meal, items, ...computeMealTotals(items) })
  }

  const totals = computeMealTotals(meal.items)

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Meal header */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setCollapsed((v) => !v)}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${MEAL_TYPE_COLORS[meal.type]}`}>
            {MEAL_TYPE_LABELS[meal.type]}
          </span>
          <Input
            value={meal.name}
            onChange={(e) => onUpdate({ ...meal, name: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            className="h-7 text-sm font-medium border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-w-0"
            placeholder="Meal name"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {totals.totalCalories > 0 && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              {totals.totalCalories} kcal · P:{totals.totalProtein}g · C:{totals.totalCarbs}g · F:{totals.totalFat}g
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          {collapsed ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      {/* Meal body */}
      {!collapsed && (
        <div className="px-4 pb-4 space-y-2 border-t border-border">
          {meal.items.length > 0 && (
            <div className="mt-3 space-y-0">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_80px_56px_48px_48px_48px_32px] gap-1 px-1 py-1 text-xs text-muted-foreground font-medium">
                <span>Food</span>
                <span>Serving</span>
                <span className="text-right">kcal</span>
                <span className="text-right">P</span>
                <span className="text-right">C</span>
                <span className="text-right">F</span>
                <span />
              </div>
              {meal.items.map((food) => (
                <div
                  key={food.id}
                  className="grid grid-cols-[1fr_80px_56px_48px_48px_48px_32px] gap-1 items-center px-1 py-1.5 rounded-lg hover:bg-muted/40 text-sm"
                >
                  <span className="truncate">{food.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{food.servingSize}</span>
                  <span className="text-right text-xs">{food.calories}</span>
                  <span className="text-right text-xs text-blue-600">{food.protein}g</span>
                  <span className="text-right text-xs text-amber-600">{food.carbs}g</span>
                  <span className="text-right text-xs text-rose-600">{food.fat}g</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveFood(food.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {showAddFood ? (
            <AddFoodForm onAdd={handleAddFood} onCancel={() => setShowAddFood(false)} />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-8 text-xs text-muted-foreground border border-dashed border-border w-full hover:border-primary/40"
              onClick={() => setShowAddFood(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add food item
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── DietForm ─────────────────────────────────────────────────────────────────

interface DietFormProps {
  plan?: MealPlan
}

export default function DietForm({ plan }: DietFormProps) {
  const navigate = useNavigate()
  const { addPlan, updatePlan } = useDietStore()
  const { toast } = useToast()
  const isEdit = !!plan

  const [name, setName] = useState(plan?.name ?? "")
  const [description, setDescription] = useState(plan?.description ?? "")
  const [targetCalories, setTargetCalories] = useState(String(plan?.targetCalories ?? 2000))
  const [targetProtein, setTargetProtein] = useState(String(plan?.targetProtein ?? 150))
  const [targetCarbs, setTargetCarbs] = useState(String(plan?.targetCarbs ?? 250))
  const [targetFat, setTargetFat] = useState(String(plan?.targetFat ?? 70))
  const [meals, setMeals] = useState<Meal[]>(
    plan?.meals ?? [
      { id: genId("meal"), type: "breakfast", name: "Breakfast", items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
      { id: genId("meal"), type: "lunch",     name: "Lunch",     items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
      { id: genId("meal"), type: "dinner",    name: "Dinner",    items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
    ],
  )

  const [saving, setSaving] = useState(false)
  const [showAddMeal, setShowAddMeal] = useState(false)

  // ── Computed totals ──────────────────────────────────────────────────────────
  const dailyTotal = meals.reduce(
    (acc, meal) => {
      const t = computeMealTotals(meal.items)
      return {
        calories: acc.calories + t.totalCalories,
        protein: acc.protein + t.totalProtein,
        carbs: acc.carbs + t.totalCarbs,
        fat: acc.fat + t.totalFat,
      }
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

  const tCal = parseInt(targetCalories) || 0
  const tPro = parseInt(targetProtein) || 0
  const tCarb = parseInt(targetCarbs) || 0
  const tFat = parseInt(targetFat) || 0

  // ── Meal mutations ───────────────────────────────────────────────────────────
  function updateMeal(id: string, updated: Meal) {
    setMeals((ms) => ms.map((m) => (m.id === id ? updated : m)))
  }

  function deleteMeal(id: string) {
    setMeals((ms) => ms.filter((m) => m.id !== id))
  }

  function addMeal(type: Meal["type"]) {
    setMeals((ms) => [
      ...ms,
      {
        id: genId("meal"),
        type,
        name: MEAL_TYPE_LABELS[type],
        items: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      },
    ])
    setShowAddMeal(false)
  }

  // ── Save ─────────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!name.trim()) {
      toast({ title: "Name required", description: "Please give your diet plan a name.", variant: "destructive" })
      return
    }

    const mealsWithTotals: Meal[] = meals.map((m) => ({ ...m, ...computeMealTotals(m.items) }))

    setSaving(true)
    try {
      if (isEdit) {
        await updatePlan(plan.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          meals: mealsWithTotals,
          targetCalories: tCal,
          targetProtein: tPro,
          targetCarbs: tCarb,
          targetFat: tFat,
        })
        toast({ title: "Diet plan updated", description: `"${name}" has been saved.` })
      } else {
        await addPlan({
          name: name.trim(),
          description: description.trim() || undefined,
          meals: mealsWithTotals,
          targetCalories: tCal,
          targetProtein: tPro,
          targetCarbs: tCarb,
          targetFat: tFat,
        })
        toast({ title: "Diet plan created", description: `"${name}" has been saved.` })
      }
      navigate("/diet-planner")
    } catch {
      toast({
        title: "Save failed",
        description: "Could not save to the server. Check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // ── Macro progress bar ───────────────────────────────────────────────────────
  function MacroBar({ label, current, target, color }: { label: string; current: number; target: number; color: string }) {
    const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0
    const over = target > 0 && current > target
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className={over ? "text-destructive font-medium" : "text-foreground"}>
            {current} / {target}{label === "Calories" ? " kcal" : "g"}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div className={`h-full rounded-full transition-all ${over ? "bg-destructive" : color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{isEdit ? "Edit Diet Plan" : "Create Diet Plan"}</h2>
          <p className="text-sm text-muted-foreground">Build your daily meal structure and macro targets.</p>
        </div>
      </div>

      {/* Plan details */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Plan Details</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="plan-name">Plan name *</Label>
            <Input
              id="plan-name"
              placeholder="e.g. Muscle Building, Cut Phase…"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plan-desc">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              id="plan-desc"
              placeholder="e.g. High protein plan for lean bulk"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Daily targets */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Daily Targets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: "cal", label: "Calories (kcal)", value: targetCalories, set: setTargetCalories },
            { id: "pro", label: "Protein (g)", value: targetProtein, set: setTargetProtein },
            { id: "carb", label: "Carbs (g)", value: targetCarbs, set: setTargetCarbs },
            { id: "fat", label: "Fat (g)", value: targetFat, set: setTargetFat },
          ].map(({ id, label, value, set }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id} className="text-xs">{label}</Label>
              <Input
                id={id}
                type="number"
                min="0"
                value={value}
                onChange={(e) => set(e.target.value)}
                className="h-9"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Meals</h3>
          <Button variant="outline" size="sm" onClick={() => setShowAddMeal((v) => !v)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Meal
          </Button>
        </div>

        {/* Add meal picker */}
        {showAddMeal && (
          <div className="flex flex-wrap gap-2 rounded-xl border border-dashed border-border p-3">
            <p className="w-full text-xs text-muted-foreground mb-1">Choose meal type:</p>
            {(["breakfast", "lunch", "dinner", "snack"] as Meal["type"][]).map((type) => (
              <Button key={type} variant="outline" size="sm" className="h-8 text-xs" onClick={() => addMeal(type)}>
                <span className={`mr-1.5 rounded-full px-1.5 py-0.5 text-xs ${MEAL_TYPE_COLORS[type]}`}>
                  {MEAL_TYPE_LABELS[type]}
                </span>
              </Button>
            ))}
            <Button variant="ghost" size="sm" className="h-8 text-xs ml-auto" onClick={() => setShowAddMeal(false)}>
              Cancel
            </Button>
          </div>
        )}

        {meals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-10 text-center space-y-2">
            <UtensilsCrossed className="mx-auto h-7 w-7 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No meals yet. Click "Add Meal" to get started.</p>
          </div>
        ) : (
          meals.map((meal) => (
            <MealSection
              key={meal.id}
              meal={meal}
              onUpdate={(updated) => updateMeal(meal.id, updated)}
              onDelete={() => deleteMeal(meal.id)}
            />
          ))
        )}
      </div>

      {/* Daily macro summary */}
      {(tCal > 0 || tPro > 0 || tCarb > 0 || tFat > 0) && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Daily Progress</h3>
          <div className="space-y-2.5">
            <MacroBar label="Calories" current={dailyTotal.calories} target={tCal} color="bg-primary" />
            <MacroBar label="Protein" current={dailyTotal.protein} target={tPro} color="bg-blue-500" />
            <MacroBar label="Carbs" current={dailyTotal.carbs} target={tCarb} color="bg-amber-500" />
            <MacroBar label="Fat" current={dailyTotal.fat} target={tFat} color="bg-rose-500" />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={() => navigate("/diet-planner")}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Save Diet Plan"}
        </Button>
      </div>
    </div>
  )
}
