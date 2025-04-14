import { Metadata } from "next"
import Dashboard from "@/components/dashboard"

export const metadata: Metadata = {
  title: "Deploy Telegram Bot - Aidog Dashboard",
  description: "Deploy a new Telegram bot agent for your community",
}

export default function DeployPage() {
  return <Dashboard initialView="deploy" />
} 