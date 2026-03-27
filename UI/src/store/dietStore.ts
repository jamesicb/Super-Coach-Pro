import { create } from "zustand"
import type { MealPlan } from "@/types"
import {
  getMealPlans as serverGetMealPlans,
  createMealPlan as serverCreateMealPlan,
  updateMealPlan as serverUpdateMealPlan,
  deleteMealPlan as serverDeleteMealPlan,
} from "@/lib/serverComm"

interface DietState {
  plans: MealPlan[]
  syncing: boolean

  loadPlans: () => Promise<void>
  addPlan: (plan: Omit<MealPlan, "id" | "createdAt" | "updatedAt">) => Promise<MealPlan>
  updatePlan: (id: string, changes: Partial<Omit<MealPlan, "id" | "createdAt">>) => Promise<void>
  deletePlan: (id: string) => void
}

export const useDietStore = create<DietState>((set, get) => ({
  plans: [],
  syncing: false,

  loadPlans: async () => {
    set({ syncing: true })
    try {
      const plans = await serverGetMealPlans()
      set({ plans })
    } catch (e) {
      console.error("Failed to load meal plans:", e)
    } finally {
      set({ syncing: false })
    }
  },

  addPlan: async (data) => {
    const plan: MealPlan = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set((state) => ({ plans: [...state.plans, plan] }))
    try {
      await serverCreateMealPlan(plan)
    } catch (e) {
      set((state) => ({ plans: state.plans.filter((p) => p.id !== plan.id) }))
      throw e
    }
    return plan
  },

  updatePlan: async (id, changes) => {
    const existing = get().plans.find((p) => p.id === id)
    if (!existing) return
    const updated: MealPlan = { ...existing, ...changes, updatedAt: new Date().toISOString() }
    const previous = existing
    set((state) => ({
      plans: state.plans.map((p) => (p.id === id ? updated : p)),
    }))
    try {
      await serverUpdateMealPlan(id, updated)
    } catch (e) {
      set((state) => ({
        plans: state.plans.map((p) => (p.id === id ? previous : p)),
      }))
      throw e
    }
  },

  deletePlan: (id) => {
    set((state) => ({ plans: state.plans.filter((p) => p.id !== id) }))
    serverDeleteMealPlan(id).catch((e) => console.error("Failed to delete meal plan:", e))
  },
}))
