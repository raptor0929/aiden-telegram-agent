"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, BarChart } from "@/components/ui/charts"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Users, Clock, ArrowUpRight } from "lucide-react"

const EngagementMetrics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Engagement Agent</h1>
          <p className="text-muted-foreground">Monitors social channels for user questions and comments</p>
        </div>
        <Tabs defaultValue="daily" className="w-[300px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Interactions"
          value="845"
          change="+12.5%"
          icon={<MessageSquare className="h-4 w-4 text-emerald-500" />}
          description="Last 24 hours"
        />
        <MetricCard
          title="Response Rate"
          value="98.2%"
          change="+2.1%"
          icon={<ArrowUpRight className="h-4 w-4 text-emerald-500" />}
          description="Questions answered"
        />
        <MetricCard
          title="Avg. Response Time"
          value="2m 14s"
          change="-18.3%"
          icon={<Clock className="h-4 w-4 text-emerald-500" />}
          description="Time to first response"
        />
        <MetricCard
          title="Unique Users"
          value="312"
          change="+8.7%"
          icon={<Users className="h-4 w-4 text-emerald-500" />}
          description="Engaged with agent"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Over Time</CardTitle>
            <CardDescription>Interactions across all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart
              className="h-[300px]"
              data={[
                { hour: "00:00", Discord: 12, Twitter: 8, Telegram: 5 },
                { hour: "04:00", Discord: 8, Twitter: 5, Telegram: 3 },
                { hour: "08:00", Discord: 25, Twitter: 18, Telegram: 10 },
                { hour: "12:00", Discord: 45, Twitter: 30, Telegram: 15 },
                { hour: "16:00", Discord: 55, Twitter: 35, Telegram: 20 },
                { hour: "20:00", Discord: 35, Twitter: 25, Telegram: 12 },
              ]}
              categories={["Discord", "Twitter", "Telegram"]}
              index="hour"
              colors={["indigo", "cyan", "blue"]}
              valueFormatter={(value: number) => `${value} msgs`}
              yAxisWidth={50}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Topic Distribution</CardTitle>
            <CardDescription>What the community is talking about</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              className="h-[300px]"
              data={[
                { topic: "Product Features", count: 145 },
                { topic: "Technical Support", count: 120 },
                { topic: "Pricing", count: 75 },
                { topic: "Roadmap", count: 65 },
                { topic: "Bugs", count: 45 },
              ]}
              category="count"
              index="topic"
              colors={["violet"]}
              valueFormatter={(value: number) => `${value} msgs`}
              layout="vertical"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Interactions</CardTitle>
          <CardDescription>Latest community engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <InteractionItem
              user={{ name: "Alex Johnson", handle: "@alexj", avatar: "/placeholder.svg?height=40&width=40" }}
              platform="Discord"
              message="How do I integrate the new API with my existing setup?"
              time="10 minutes ago"
              priority="High"
            />
            <InteractionItem
              user={{ name: "Sarah Miller", handle: "@sarahm", avatar: "/placeholder.svg?height=40&width=40" }}
              platform="Twitter"
              message="Loving the new dashboard features! Any plans to add custom widgets?"
              time="25 minutes ago"
              priority="Medium"
            />
            <InteractionItem
              user={{ name: "David Chen", handle: "@davidc", avatar: "/placeholder.svg?height=40&width=40" }}
              platform="Telegram"
              message="When is the next community call scheduled?"
              time="1 hour ago"
              priority="Low"
            />
            <InteractionItem
              user={{ name: "Emma Wilson", handle: "@emmaw", avatar: "/placeholder.svg?height=40&width=40" }}
              platform="Discord"
              message="Found a bug in the latest release. The export function isn't working."
              time="2 hours ago"
              priority="High"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const MetricCard = ({ title, value, change, icon, description }: { title: string, value: string, change: string, icon: React.ReactNode, description: string }) => {
  const isPositive = !change.startsWith("-")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className={`mt-1 flex items-center text-xs ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
          {change}
        </div>
      </CardContent>
    </Card>
  )
}

const InteractionItem = ({ user, platform, message, time, priority }: { user: { name: string, handle: string, avatar: string }, platform: string, message: string, time: string, priority: string }) => {
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Discord":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100"
      case "Twitter":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
      case "Telegram":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  return (
    <div className="flex items-start space-x-4 rounded-lg border p-4">
      <Avatar>
        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center">
          <p className="font-medium">{user.name}</p>
          <span className="ml-2 text-sm text-muted-foreground">{user.handle}</span>
          <Badge variant="outline" className={`ml-2 ${getPlatformColor(platform)}`}>
            {platform}
          </Badge>
        </div>
        <p>{message}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{time}</span>
          <Badge className={getPriorityColor(priority)}>{priority}</Badge>
        </div>
      </div>
    </div>
  )
}

export default EngagementMetrics
