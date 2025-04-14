"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart, DonutChart } from "@/components/ui/charts"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, ThumbsUp } from "lucide-react"

const SentimentAnalysisMetrics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sentiment Analysis Agent</h1>
          <p className="text-muted-foreground">Tracks community sentiment in real-time</p>
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
          title="Overall Sentiment"
          value="8.4/10"
          change="+0.6"
          icon={<ThumbsUp className="h-4 w-4 text-violet-500" />}
          description="Community satisfaction"
        />
        <MetricCard
          title="Positive Mentions"
          value="78%"
          change="+5.2%"
          icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
          description="Of total mentions"
        />
        <MetricCard
          title="Negative Mentions"
          value="12%"
          change="-2.1%"
          icon={<TrendingDown className="h-4 w-4 text-emerald-500" />}
          description="Of total mentions"
        />
        <MetricCard
          title="Issues Detected"
          value="3"
          change="-1"
          icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
          description="Requiring attention"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
            <CardDescription>30-day rolling average</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              className="h-[300px]"
              data={[
                { date: "May 15", sentiment: 7.2 },
                { date: "May 20", sentiment: 7.5 },
                { date: "May 25", sentiment: 7.8 },
                { date: "May 30", sentiment: 7.6 },
                { date: "Jun 4", sentiment: 8.0 },
                { date: "Jun 9", sentiment: 8.4 },
              ]}
              categories={["sentiment"]}
              index="date"
              colors={["violet"]}
              valueFormatter={(value: number) => `${value}/10`}
              yAxisWidth={40}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment by Platform</CardTitle>
            <CardDescription>Average sentiment score</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              className="h-[300px]"
              data={[
                { platform: "Discord", score: 8.7 },
                { platform: "Twitter", score: 7.9 },
                { platform: "Telegram", score: 8.2 },
                { platform: "Reddit", score: 7.5 },
              ]}
              category="score"
              index="platform"
              colors={["violet"]}
              valueFormatter={(value: number) => `${value}/10`}
              layout="vertical"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sentiment by Topic</CardTitle>
            <CardDescription>How users feel about different aspects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <SentimentTopic topic="Product Features" score={9.2} positive={92} neutral={6} negative={2} />
              <SentimentTopic topic="User Interface" score={8.7} positive={85} neutral={10} negative={5} />
              <SentimentTopic topic="Performance" score={7.5} positive={70} neutral={15} negative={15} />
              <SentimentTopic topic="Documentation" score={6.8} positive={60} neutral={25} negative={15} />
              <SentimentTopic topic="Pricing" score={7.2} positive={65} neutral={20} negative={15} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>Overall community feeling</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              className="h-[300px]"
              data={[
                { sentiment: "Positive", value: 78 },
                { sentiment: "Neutral", value: 10 },
                { sentiment: "Negative", value: 12 },
              ]}
              category="value"
              index="sentiment"
              colors={["emerald", "blue", "rose"]}
              valueFormatter={(value: number) => `${value}%`}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Alerts</CardTitle>
          <CardDescription>Issues requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SentimentAlert
              title="Negative sentiment spike in Discord"
              description="Multiple users reporting issues with the latest update"
              platform="Discord"
              severity="High"
              time="2h ago"
            />
            <SentimentAlert
              title="Pricing concerns trending on Twitter"
              description="Several influential users discussing pricing structure"
              platform="Twitter"
              severity="Medium"
              time="5h ago"
            />
            <SentimentAlert
              title="Documentation confusion"
              description="Users struggling with API documentation section"
              platform="Telegram"
              severity="Low"
              time="1d ago"
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

const SentimentTopic = ({ topic, score, positive, neutral, negative }: { topic: string, score: number, positive: number, neutral: number, negative: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-emerald-500"
    if (score >= 7.0) return "text-blue-500"
    if (score >= 5.0) return "text-amber-500"
    return "text-rose-500"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{topic}</h4>
        <span className={`font-bold ${getScoreColor(score)}`}>{score}/10</span>
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div className="bg-emerald-500" style={{ width: `${positive}%` }} />
        <div className="bg-blue-500" style={{ width: `${neutral}%` }} />
        <div className="bg-rose-500" style={{ width: `${negative}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{positive}% Positive</span>
        <span>{neutral}% Neutral</span>
        <span>{negative}% Negative</span>
      </div>
    </div>
  )
}

const SentimentAlert = ({ title, description, platform, severity, time }: { title: string, description: string, platform: string, severity: string, time: string }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

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

  return (
    <div className="flex items-start justify-between rounded-lg border p-4">
      <div className="flex items-start space-x-4">
        <div className="mt-0.5">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <Badge variant="outline" className={getSeverityColor(severity)}>
          {severity}
        </Badge>
        <Badge variant="outline" className={getPlatformColor(platform)}>
          {platform}
        </Badge>
        <span className="text-sm text-muted-foreground">{time}</span>
      </div>
    </div>
  )
}

export default SentimentAnalysisMetrics
