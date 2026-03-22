import { Link } from "react-router-dom"
import { Dumbbell, Flame, TrendingUp, Zap, ArrowRight, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MOCK_WORKOUTS } from "@/mock/workouts"
import { MOCK_SESSIONS } from "@/mock/sessions"

const todayWorkout = MOCK_WORKOUTS[0]
const recentSessions = MOCK_SESSIONS.slice(0, 3)

const macros = { calories: 1840, targetCalories: 2400, protein: 145, targetProtein: 180, carbs: 210, targetCarbs: 260, fat: 58, targetFat: 70 }

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: React.ElementType; color: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
          <div className={`p-2.5 rounded-lg ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold">GIVE IT TO ME PAPI! 📈</h2>
        <p className="text-muted-foreground mt-1">Sunday, 22 March 2026 — Push Day scheduled today</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Workouts this week" value="3" sub="+1 from last week" icon={Dumbbell} color="bg-blue-500" />
        <StatCard label="Calories today" value="1,840" sub="560 kcal remaining" icon={Flame} color="bg-orange-500" />
        <StatCard label="Total volume" value="24,960 kg" sub="This week" icon={TrendingUp} color="bg-emerald-500" />
        <StatCard label="Streak" value="12 days" sub="Personal best!" icon={Zap} color="bg-purple-500" />
      </div>

      {/* Today's workout + Macros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's workout */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Today's Workout</CardTitle>
                <CardDescription>{todayWorkout.name}</CardDescription>
              </div>
              <Badge variant="secondary">{todayWorkout.estimatedDuration} min</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayWorkout.exercises.slice(0, 4).map((ex) => (
              <div key={ex.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="font-medium">{ex.name}</span>
                </div>
                <span className="text-muted-foreground">
                  {ex.sets.length} × {ex.sets[0].reps} reps
                  {ex.sets[0].weight > 0 && ` @ ${ex.sets[0].weight}kg`}
                </span>
              </div>
            ))}
            {todayWorkout.exercises.length > 4 && (
              <p className="text-xs text-muted-foreground">+{todayWorkout.exercises.length - 4} more exercises</p>
            )}
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link to={`/live-workout/${todayWorkout.id}`}>
                  <Zap className="h-4 w-4" />
                  Start Workout
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Macro summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Today's Nutrition</CardTitle>
            <CardDescription>
              {macros.calories} / {macros.targetCalories} kcal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-blue-600">Calories</span>
                <span className="text-muted-foreground">{macros.calories} / {macros.targetCalories} kcal</span>
              </div>
              <Progress value={(macros.calories / macros.targetCalories) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-red-500">Protein</span>
                <span className="text-muted-foreground">{macros.protein}g / {macros.targetProtein}g</span>
              </div>
              <Progress value={(macros.protein / macros.targetProtein) * 100} className="h-2 [&>div]:bg-red-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-yellow-500">Carbs</span>
                <span className="text-muted-foreground">{macros.carbs}g / {macros.targetCarbs}g</span>
              </div>
              <Progress value={(macros.carbs / macros.targetCarbs) * 100} className="h-2 [&>div]:bg-yellow-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-emerald-500">Fat</span>
                <span className="text-muted-foreground">{macros.fat}g / {macros.targetFat}g</span>
              </div>
              <Progress value={(macros.fat / macros.targetFat) * 100} className="h-2 [&>div]:bg-emerald-500" />
            </div>
            <Button variant="outline" asChild className="w-full">
              <Link to="/diet-planner">
                View Meal Plan <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/progress">View all <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSessions.map((sess) => (
              <div key={sess.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{sess.workoutName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(sess.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">{(sess.totalVolume / 1000).toFixed(1)}t</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                    <Clock className="h-3 w-3" />
                    {Math.round(sess.elapsedSeconds / 60)} min
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
