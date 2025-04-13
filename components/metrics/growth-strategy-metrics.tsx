"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart, DonutChart } from "@/components/ui/charts"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Target, Award, Lightbulb } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const GrowthStrategyMetrics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Growth Strategy Agent</h1>
          <p className="text-muted-foreground">Analyzes community growth patterns and suggests strategies</p>
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
          title="New Members"
          value="583"
          change="+28.3%"
          icon={<Users className="h-4 w-4 text-rose-500" />}
          description="This month"
        />
        <MetricCard
          title="Growth Rate"
          value="12.4%"
          change="+2.1%"
          icon={<TrendingUp className="h-4 w-4 text-rose-500" />}
          description="Month-over-month"
        />
        <MetricCard
          title="Retention Rate"
          value="87.2%"
          change="+3.5%"
          icon={<Target className="h-4 w-4 text-rose-500" />}
          description="30-day retention"
        />
        <MetricCard
          title="Active Campaigns"
          value="4"
          change="+1"
          icon={<Award className="h-4 w-4 text-rose-500" />}
          description="Growth initiatives"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Community Growth</CardTitle>
            <CardDescription>Members over time</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              className="h-[300px]"
              data={[
                { date: "Jan", members: 2450 },
                { date: "Feb", members: 2780 },
                { date: "Mar", members: 3120 },
                { date: "Apr", members: 3580 },
                { date: "May", members: 4150 },
                { date: "Jun", members: 4733 },
              ]}
              categories={["members"]}
              index="date"
              colors={["rose"]}
              valueFormatter={(value) => `${value}`}
              yAxisWidth={60}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member Sources</CardTitle>
            <CardDescription>Where new members come from</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              className="h-[300px]"
              data={[
                { source: "Organic Search", value: 35 },
                { source: "Social Media", value: 25 },
                { source: "Referrals", value: 20 },
                { source: "Events", value: 12 },
                { source: "Other", value: 8 },
              ]}
              category="value"
              index="source"
              colors={["rose", "pink", "orange", "amber", "blue"]}
              valueFormatter={(value) => `${value}%`}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Growth Campaigns</CardTitle>
            <CardDescription>Active community growth initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <GrowthCampaign
                title="Referral Program"
                description="Reward members for inviting friends"
                progress={75}
                target="200 new members"
                timeframe="30 days"
                status="Active"
              />
              <GrowthCampaign
                title="Developer Challenge"
                description="Hackathon for building on our platform"
                progress={45}
                target="50 project submissions"
                timeframe="14 days remaining"
                status="Active"
              />
              <GrowthCampaign
                title="Content Creator Program"
                description="Partner with influencers for tutorials"
                progress={30}
                target="10 partner creators"
                timeframe="60 days"
                status="Active"
              />
              <GrowthCampaign
                title="Community AMA Series"
                description="Weekly AMAs with team members"
                progress={85}
                target="500 attendees per session"
                timeframe="Ongoing"
                status="Active"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member Demographics</CardTitle>
            <CardDescription>Community composition</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              className="h-[300px]"
              data={[
                { role: "Developers", percentage: 45 },
                { role: "Product Managers", percentage: 20 },
                { role: "Designers", percentage: 15 },
                { role: "Founders", percentage: 10 },
                { role: "Others", percentage: 10 },
              ]}
              category="percentage"
              index="role"
              colors={["rose"]}
              valueFormatter={(value) => `${value}%`}
              layout="vertical"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Growth Recommendations</CardTitle>
          <CardDescription>AI-generated growth strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <GrowthRecommendation
              title="Launch a Technical Workshop Series"
              description="Host bi-weekly technical workshops focusing on advanced use cases of your product. Data shows 78% of your power users would attend."
              impact="High"
              effort="Medium"
              timeframe="2-4 weeks"
            />
            <GrowthRecommendation
              title="Implement Tiered Community Roles"
              description="Create achievement-based roles in Discord to gamify community participation. Similar communities saw 35% increase in engagement."
              impact="Medium"
              effort="Low"
              timeframe="1-2 weeks"
            />
            <GrowthRecommendation
              title="Cross-Promotion with Complementary Communities"
              description="Partner with 3-5 complementary product communities for cross-promotion. Target communities with 5K+ members."
              impact="High"
              effort="Medium"
              timeframe="4-6 weeks"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const MetricCard = ({ title, value, change, icon, description }) => {
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

const GrowthCampaign = ({ title, description, progress, target, timeframe, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
      case "Planned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
      case "Completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant="outline" className={getStatusColor(status)}>
          {status}
        </Badge>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Target: {target}</span>
          <span>{timeframe}</span>
        </div>
      </div>
    </div>
  )
}

const GrowthRecommendation = ({ title, description, impact, effort, timeframe }) => {
  const getImpactColor = (impact) => {
    switch (impact) {
      case "High":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
      case "Medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
      case "Low":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const getEffortColor = (effort) => {
    switch (effort) {
      case "Low":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
      case "High":
        return "bg-rose-100 text-rose-800 dark:bg-rose-800 dark:text-rose-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  return (
    <div className="flex items-start space-x-4 rounded-lg border p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900">
        <Lightbulb className="h-5 w-5 text-rose-700 dark:text-rose-300" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline" className={getImpactColor(impact)}>
            Impact: {impact}
          </Badge>
          <Badge variant="outline" className={getEffortColor(effort)}>
            Effort: {effort}
          </Badge>
          <Badge variant="outline">Timeframe: {timeframe}</Badge>
        </div>
      </div>
    </div>
  )
}

export default GrowthStrategyMetrics
