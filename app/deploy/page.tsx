import { Metadata } from "next"
import DeployForm from "@/components/deploy-form"

export const metadata: Metadata = {
  title: "Deploy Telegram Bot - Aiden Dashboard",
  description: "Deploy a new Telegram bot agent for your community",
}

export default function DeployPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Deploy Telegram Bot</h1>
        <p className="text-muted-foreground">
          Create and deploy a new Telegram bot agent for your community management.
        </p>
        <DeployForm />
      </div>
    </div>
  )
} 