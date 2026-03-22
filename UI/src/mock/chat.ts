import type { ChatMessage } from "@/types"

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-001",
    role: "assistant",
    content: "Hey! I'm your Super Coach Pro AI assistant. I can help you with workout programming, nutrition advice, recovery tips, and more. What would you like to work on today?",
    timestamp: "2026-03-22T08:00:00Z",
  },
  {
    id: "msg-002",
    role: "user",
    content: "I've been doing Push/Pull/Legs 3 days a week. Should I increase to 6 days?",
    timestamp: "2026-03-22T08:01:00Z",
  },
  {
    id: "msg-003",
    role: "assistant",
    content: "Great question! Moving from 3 to 6 days (PPL×2) is a solid progression if you're ready. Here's what to consider:\n\n**Ready to increase if:**\n- You've been consistent on 3-day PPL for 3+ months\n- You're recovering well between sessions\n- Sleep and nutrition are dialled in\n\n**6-day PPL benefits:**\n- Each muscle group trained twice per week\n- More volume = more hypertrophy stimulus\n- Better skill practice on compound lifts\n\nI'd suggest running 3-day PPL for one more month to solidify your base, then transitioning. Want me to sketch out a 6-day plan based on your current routine?",
    timestamp: "2026-03-22T08:01:30Z",
  },
  {
    id: "msg-004",
    role: "user",
    content: "Yes please! Also what should my protein intake be?",
    timestamp: "2026-03-22T08:02:00Z",
  },
  {
    id: "msg-005",
    role: "assistant",
    content: "For muscle building, aim for **1.6–2.2g of protein per kg of bodyweight** daily. If you're 80kg, that's 128–176g/day.\n\nA 6-day PPL split could look like this:\n\n| Day | Session |\n|-----|--------|\n| Mon | Push A (strength focus) |\n| Tue | Pull A (strength focus) |\n| Wed | Legs A |\n| Thu | Push B (hypertrophy focus) |\n| Fri | Pull B (hypertrophy focus) |\n| Sat | Legs B |\n| Sun | Rest |\n\nWant me to build out the exercises for each day?",
    timestamp: "2026-03-22T08:02:45Z",
  },
]

export const MOCK_AI_REPLIES: string[] = [
  "Great question! Based on your training history, I'd recommend focusing on progressive overload — add 2.5kg to your main lifts each week.",
  "Recovery is just as important as training. Make sure you're getting 7–9 hours of sleep and staying hydrated with at least 3L of water daily.",
  "For fat loss while maintaining muscle, aim for a moderate calorie deficit of 300–500 kcal below maintenance. Keep protein high at 2g/kg bodyweight.",
  "Your squat form sounds good! To break through plateaus, try adding a pause at the bottom for 2 seconds — this eliminates the stretch reflex and makes you stronger out of the hole.",
  "Creatine monohydrate is the most researched supplement for strength and muscle. 3–5g daily is the effective dose — no loading phase needed.",
]
