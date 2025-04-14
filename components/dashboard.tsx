"use client"

import { useState } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar" // Using shadcn sidebar [^1]
import { ModeToggle } from "@/components/mode-toggle"
import { Activity, Calendar, BarChart3, TrendingUp, Shield, Home, Settings, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import EngagementMetrics from "@/components/metrics/engagement-metrics"
import ContentSchedulingMetrics from "@/components/metrics/content-scheduling-metrics"
import SentimentAnalysisMetrics from "@/components/metrics/sentiment-analysis-metrics"
import GrowthStrategyMetrics from "@/components/metrics/growth-strategy-metrics"
import ModerationMetrics from "@/components/metrics/moderation-metrics"
import OverviewMetrics from "@/components/metrics/overview-metrics"
import DeployForm from "@/components/deploy-form"

const Dashboard = () => {
  const [activeView, setActiveView] = useState("overview")

  const renderMetricsComponent = () => {
    switch (activeView) {
      case "engagement":
        return <EngagementMetrics />
      case "content":
        return <ContentSchedulingMetrics />
      case "sentiment":
        return <SentimentAnalysisMetrics />
      case "growth":
        return <GrowthStrategyMetrics />
      case "moderation":
        return <ModerationMetrics />
      case "deploy":
        return <DeployForm />
      case "overview":
      default:
        return <OverviewMetrics />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <Users className="h-6 w-6" />
              <span className="font-semibold">Community AI Manager</span>
            </div>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeView === "overview"} onClick={() => setActiveView("overview")}>
                      <Home />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>AI Agents</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeView === "deploy"}
                      onClick={() => setActiveView("deploy")}
                    >
                      <Plus />
                      <span>Deploy New Bot</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeView === "engagement"}
                      onClick={() => setActiveView("engagement")}
                    >
                      <Activity />
                      <span>Engagement Agent</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeView === "content"} onClick={() => setActiveView("content")}>
                      <Calendar />
                      <span>Content Scheduling</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeView === "sentiment"} onClick={() => setActiveView("sentiment")}>
                      <BarChart3 />
                      <span>Sentiment Analysis</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeView === "growth"} onClick={() => setActiveView("growth")}>
                      <TrendingUp />
                      <span>Growth Strategy</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeView === "moderation"}
                      onClick={() => setActiveView("moderation")}
                    >
                      <Shield />
                      <span>Moderation</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center justify-between p-4">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <ModeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl">{renderMetricsComponent()}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Dashboard
