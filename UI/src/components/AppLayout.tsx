import { Outlet } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import BottomNav from "@/components/BottomNav"

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
