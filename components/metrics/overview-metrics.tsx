"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Calendar, BarChart3, TrendingUp, AlertCircle } from "lucide-react"
import { AreaChart, BarChart, DonutChart } from "@/components/ui/charts"

const OverviewMetrics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
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
          value="2,845"
          change="+12.5%"
          icon={<Activity className="h-4 w-4 text-emerald-500" />}
          description="Across all platforms"
        />
        <MetricCard
          title="Content Published"
          value="124"
          change="+5.2%"
          icon={<Calendar className="h-4 w-4 text-blue-500" />}
          description="Last 30 days"
        />
        <MetricCard
          title="Sentiment Score"
          value="8.4/10"
          change="+0.6"
          icon={<BarChart3 className="h-4 w-4 text-violet-500" />}
          description="Community satisfaction"
        />
        <MetricCard
          title="New Members"
          value="583"
          change="+28.3%"
          icon={<TrendingUp className="h-4 w-4 text-rose-500" />}
          description="Growth this month"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
            <CardDescription>Efficiency metrics across all AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart
              className="h-[300px]"
              data={[
                { date: "Jan", Engagement: 120, Content: 80, Sentiment: 90, Growth: 70, Moderation: 110 },
                { date: "Feb", Engagement: 140, Content: 100, Sentiment: 95, Growth: 90, Moderation: 105 },
                { date: "Mar", Engagement: 160, Content: 120, Sentiment: 100, Growth: 110, Moderation: 100 },
                { date: "Apr", Engagement: 180, Content: 140, Sentiment: 110, Growth: 130, Moderation: 95 },
                { date: "May", Engagement: 200, Content: 160, Sentiment: 120, Growth: 150, Moderation: 90 },
                { date: "Jun", Engagement: 220, Content: 180, Sentiment: 130, Growth: 170, Moderation: 85 },
              ]}
              categories={["Engagement", "Content", "Sentiment", "Growth", "Moderation"]}
              index="date"
              colors={["emerald", "blue", "violet", "rose", "amber"]}
              valueFormatter={(value) => `${value}%`}
              yAxisWidth={40}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Workload</CardTitle>
            <CardDescription>Distribution of tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              className="h-[300px]"
              data={[
                { name: "Engagement", value: 35 },
                { name: "Content", value: 20 },
                { name: "Sentiment", value: 15 },
                { name: "Growth", value: 15 },
                { name: "Moderation", value: 15 },
              ]}
              category="value"
              index="name"
              colors={["emerald", "blue", "violet", "rose", "amber"]}
              valueFormatter={(value) => `${value}%`}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Issues Requiring Attention</CardTitle>
            <CardDescription>Flagged by AI agents for human review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <IssueItem
                title="Negative sentiment spike in Discord"
                agent="Sentiment Analysis"
                priority="High"
                time="2h ago"
              />
              <IssueItem title="Potential spam accounts detected" agent="Moderation" priority="Medium" time="5h ago" />
              <IssueItem title="Content schedule conflict" agent="Content Scheduling" priority="Low" time="1d ago" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription>Community activity by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              className="h-[300px]"
              data={[
                { platform: "Discord", value: 45 },
                { platform: "Twitter", value: 30 },
                { platform: "Telegram", value: 15 },
                { platform: "Reddit", value: 10 },
              ]}
              category="value"
              index="platform"
              colors={["violet"]}
              valueFormatter={(value) => `${value}%`}
              layout="vertical"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const MetricCard = ({ title, value, change, icon, description }) => {
  const isPositive = change.startsWith("+")

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

const IssueItem = ({ title, agent, priority, time }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-500"
      case "Medium":
        return "text-amber-500"
      case "Low":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">Agent: {agent}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-medium ${getPriorityColor(priority)}`}>{priority}</p>
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}

export default OverviewMetrics
