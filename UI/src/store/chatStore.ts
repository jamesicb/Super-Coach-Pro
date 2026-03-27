import { create } from "zustand"
import type { ChatMessage } from "@/types"
import { sendChatMessage, type ChatTurn } from "@/lib/serverComm"

interface ChatState {
  messages: ChatMessage[]
  loading: boolean
  error: string | null

  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

function genId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "msg-welcome",
  role: "assistant",
  content:
    "Hey! I'm your Super Coach Pro AI. I can help you build personalised workout plans, design nutrition strategies, and answer any fitness questions you have. What would you like to work on today?",
  timestamp: new Date().toISOString(),
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [WELCOME_MESSAGE],
  loading: false,
  error: null,

  sendMessage: async (content: string) => {
    const userMsg: ChatMessage = {
      id: genId(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    }

    set((state) => ({
      messages: [...state.messages, userMsg],
      loading: true,
      error: null,
    }))

    // Build the full conversation history to send (excluding the welcome placeholder)
    const allMessages = [...get().messages]
    const turns: ChatTurn[] = allMessages
      .filter((m) => m.id !== "msg-welcome")
      .map((m) => ({ role: m.role, content: m.content }))

    try {
      const reply = await sendChatMessage(turns)
      const assistantMsg: ChatMessage = {
        id: genId(),
        role: "assistant",
        content: reply,
        timestamp: new Date().toISOString(),
      }
      set((state) => ({ messages: [...state.messages, assistantMsg], loading: false }))
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Failed to get a response. Please try again.",
      })
    }
  },

  clearMessages: () =>
    set({ messages: [{ ...WELCOME_MESSAGE, timestamp: new Date().toISOString() }], error: null }),
}))
