# Super Coach Pro
## Project Description
We are building an AI-powered fitness app called "Super Coach Pro".The app will allow users to configure workout routines and diet plans and review their progress over time. Here are the core features: 
- Workout Planner 
- Diet planner
- Calendar
- AI Chat to get recommendations

The user should be bale to plan a workout and diet and add the workout to their calendar
There should be a 'Live' mode for the workouts where they can press 'start' and begin tracking their sets.Once complete, the data will be stored for the day and they can reference it later.

## Implementation Steps /TODO
> Scope: Frontend UI mockup only. All data is hardcoded mock data. No API calls, no backend, no database. API/backend integration is a separate phase.

### Phase 1 — Project Setup & Foundation ✅
- [x] 1.1 Initialize React project with Vite + TypeScript
- [x] 1.2 Install core dependencies: React Router v6, Zustand (state management), date-fns (date utils)
- [x] 1.3 Install UI dependencies: Tailwind CSS, shadcn/ui component library, Lucide React (icons), Recharts (charts/graphs), Framer Motion (animations)
- [x] 1.4 Configure folder structure: `/src/pages`, `/src/components`, `/src/store`, `/src/mock`, `/src/types`, `/src/utils`
- [x] 1.5 Set up React Router with a root layout and define all top-level routes
- [x] 1.6 Create global TypeScript types/interfaces: `Workout`, `Exercise`, `Set`, `MealPlan`, `Meal`, `FoodItem`, `CalendarEvent`, `WorkoutSession`, `ChatMessage`
- [x] 1.7 Create `/src/mock/` data files with rich hardcoded sample data for all features

### Phase 2 — Layout & Navigation ✅
- [x] 2.1 Build root `AppLayout` component with persistent sidebar and top header
- [x] 2.2 Build `Sidebar` with navigation links: Dashboard, Workout Planner, Diet Planner, Calendar, Live Workout, Progress, AI Chat
- [x] 2.3 Build `Header` component with page title, user avatar, and notifications icon
- [x] 2.4 Build `BottomNav` component for mobile responsiveness
- [x] 2.5 Create a `Dashboard` home page showing today's scheduled workout, calorie summary, and a recent activity feed (all mock data)

### Phase 3 — Authentication Screens
- [ ] 3.1 Build `LoginPage` — email/password form, "Remember me" checkbox, link to register (no real auth logic, just navigate to dashboard on submit)
- [ ] 3.2 Build `RegisterPage` — name, email, password, fitness goal selection (no real auth logic)
- [ ] 3.3 Build `ProtectedRoute` wrapper that redirects to login if no mock session exists in Zustand

### Phase 4 — Workout Planner ✅
- [x] 4.1 Build `WorkoutPlannerPage` — grid/list of workout routine cards populated from mock data
- [x] 4.2 Build `CreateWorkoutPage` — form to name a routine and add exercises; stores new routine in Zustand
- [x] 4.3 Build `ExerciseSearchModal` — searchable/filterable list from a mock exercise library
- [x] 4.4 Build `ExerciseCard` — shows exercise name, muscle group, sets × reps, and target weight
- [x] 4.5 Build `EditWorkoutPage` — reuses the create form pre-populated with mock routine data
- [x] 4.6 Create `workoutStore` (Zustand) — holds workout routines in memory, seeded with mock data

### Phase 5 — Diet Planner
- [ ] 5.1 Build `DietPlannerPage` — daily meal plan view with breakfast, lunch, dinner, snacks sections
- [ ] 5.2 Build `CreateMealPlanPage` — form to name and build a meal plan; stores in Zustand
- [ ] 5.3 Build `FoodSearchModal` — searchable list from a mock food database with macros
- [ ] 5.4 Build `FoodItemCard` — displays food name, serving size, calories, protein, carbs, fat
- [ ] 5.5 Build `MacrosSummaryBar` — progress bars for daily protein/carbs/fat targets vs. totals
- [ ] 5.6 Create `dietStore` (Zustand) — holds meal plans in memory, seeded with mock data

### Phase 6 — Calendar
- [ ] 6.1 Build `CalendarPage` — monthly grid view built with date-fns
- [ ] 6.2 Build `CalendarDayCell` — shows colour-coded event chips for workouts and meals on each day
- [ ] 6.3 Build `AddToCalendarModal` — lets user assign a workout or meal plan to a date; updates Zustand
- [ ] 6.4 Build `EventDetailPopover` — shows full event info on day/chip click
- [ ] 6.5 Create `calendarStore` (Zustand) — manages events in memory, seeded with mock events
- [ ] 6.6 Implement view toggle: Month / Week / Day

### Phase 7 — Live Workout Mode
- [ ] 7.1 Build `LiveWorkoutPage` — user selects a workout from mock data and presses Start
- [ ] 7.2 Build `ActiveWorkoutTracker` — step-by-step exercise flow: exercise name, set X of Y, target reps/weight
- [ ] 7.3 Build `SetLogger` — number inputs to log actual reps and weight for each set
- [ ] 7.4 Build `RestTimer` — visual countdown timer between sets
- [ ] 7.5 Build `WorkoutCompleteScreen` — summary card of sets completed, total volume lifted, and elapsed time
- [ ] 7.6 On completion, save the session object into `workoutSessionStore` (Zustand in-memory)
- [ ] 7.7 Add ability to skip an exercise or add an extra set during a live session

### Phase 8 — Progress & History
- [ ] 8.1 Build `ProgressPage` — tabbed page: Workouts | Nutrition | Body Stats
- [ ] 8.2 Build `WorkoutHistoryList` — scrollable list of past sessions from mock/Zustand data
- [ ] 8.3 Build `WorkoutSessionDetail` — drill-down view of one session showing each exercise and sets logged
- [ ] 8.4 Build `ExerciseProgressChart` — Recharts line chart of weight over time for a selected exercise (mock data)
- [ ] 8.5 Build `NutritionHistoryChart` — Recharts bar chart of daily calorie and macro intake (mock data)
- [ ] 8.6 Build `PersonalRecordsTable` — best weight × reps per exercise from mock data

### Phase 9 — AI Chat
- [ ] 9.1 Build `AIChatPage` — full-page chat UI with scrollable message thread and sticky input bar
- [ ] 9.2 Build `ChatMessage` component — distinct styling for user messages vs. AI responses, with basic markdown rendering
- [ ] 9.3 Build `ChatInput` — multi-line input with send button; on submit, append a hardcoded mock AI reply after a short simulated delay
- [ ] 9.4 Create `chatStore` (Zustand) — holds conversation history in memory, pre-seeded with a mock opening exchange

### Phase 10 — Polish & UX
- [ ] 10.1 Add empty states with helpful CTAs on all list/planner pages (e.g. "No workouts yet — create your first routine")
- [ ] 10.2 Add toast notifications for in-app actions (create, delete, complete workout) using a lightweight toast component
- [ ] 10.3 Ensure full mobile responsiveness across all pages
- [ ] 10.4 Add page transition animations with Framer Motion
- [ ] 10.5 Accessibility pass: keyboard navigation, ARIA labels, sufficient colour contrast
