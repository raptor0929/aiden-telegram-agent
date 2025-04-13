import type { Metadata } from "next"
import Dashboard from "@/components/dashboard"

export const metadata: Metadata = {
  title: "Community Manager AI Dashboard",
  description: "Monitor and manage your community management AI agents",
}

export default function Home() {
  return <Dashboard />
}
