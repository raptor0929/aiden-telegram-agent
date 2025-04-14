"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart } from "@/components/ui/charts"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, CheckCircle, Clock, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const ModerationMetrics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moderation Agent</h1>
          <p className="text-muted-foreground">Identifies harmful content and maintains community guidelines</p>
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
          title="Content Moderated"
          value="2,845"
          change="+215"
          icon={<Shield className="h-4 w-4 text-amber-500" />}
          description="Last 24 hours"
        />
        <MetricCard
          title="Flagged Content"
          value="42"
          change="-8"
          icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
          description="Requiring review"
        />
        <MetricCard
          title="Auto-Resolved"
          value="94.8%"
          change="+1.2%"
          icon={<CheckCircle className="h-4 w-4 text-amber-500" />}
          description="Without human input"
        />
        <MetricCard
          title="Avg. Response Time"
          value="1m 12s"
          change="-15s"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
          description="To moderate content"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Moderation Activity</CardTitle>
            <CardDescription>Content moderated over time</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              className="h-[300px]"
              data={[
                { hour: "00:00", moderated: 85, flagged: 5 },
                { hour: "04:00", moderated: 65, flagged: 3 },
                { hour: "08:00", moderated: 120, flagged: 7 },
                { hour: "12:00", moderated: 175, flagged: 10 },
                { hour: "16:00", moderated: 210, flagged: 12 },
                { hour: "20:00", moderated: 190, flagged: 8 },
              ]}
              categories={["moderated", "flagged"]}
              index="hour"
              colors={["amber", "red"]}
              valueFormatter={(value: number) => `${value}`}
              yAxisWidth={50}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Violation Types</CardTitle>
            <CardDescription>Categories of content violations</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              className="h-[300px]"
              data={[
                { type: "Spam", count: 45 },
                { type: "Harassment", count: 12 },
                { type: "Misinformation", count: 8 },
                { type: "Inappropriate", count: 15 },
                { type: "Scam Attempts", count: 20 },
              ]}
              category="count"
              index="type"
              colors={["amber"]}
              valueFormatter={(value: number) => `${value}`}
              layout="vertical"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Flagged Content</CardTitle>
            <CardDescription>Items requiring human review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FlaggedContent
                user={{ name: "John Smith", handle: "@johnsmith", avatar: "/placeholder.svg?height=40&width=40" }}
                platform="Discord"
                content="Check out this amazing investment opportunity! 1000% returns guaranteed. DM me for details."
                reason="Potential scam"
                time="15 minutes ago"
                severity="High"
              />
              <FlaggedContent
                user={{ name: "Alice Johnson", handle: "@alicej", avatar: "/placeholder.svg?height=40&width=40" }}
                platform="Twitter"
                content="Your product is terrible and your team is incompetent. Worst experience ever."
                reason="Harassment"
                time="45 minutes ago"
                severity="Medium"
              />
              <FlaggedContent
                user={{ name: "New Account", handle: "@user12345", avatar: "/placeholder.svg?height=40&width=40" }}
                platform="Telegram"
                content="Join our group for exclusive access to unreleased features. Link: bit.ly/suspicious-link"
                reason="Suspicious link"
                time="1 hour ago"
                severity="High"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suspicious Users</CardTitle>
            <CardDescription>Accounts flagged for review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SuspiciousUser name="crypto_trader_92" joinDate="Today" flags={5} reason="Spam messages" risk="High" />
              <SuspiciousUser
                name="new_user_5839"
                joinDate="Yesterday"
                flags={3}
                reason="Multiple accounts"
                risk="Medium"
              />
              <SuspiciousUser
                name="free_tokens_now"
                joinDate="3 days ago"
                flags={4}
                reason="Scam attempts"
                risk="High"
              />
              <SuspiciousUser
                name="help_desk_support"
                joinDate="1 week ago"
                flags={2}
                reason="Impersonation"
                risk="Medium"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moderation Performance</CardTitle>
          <CardDescription>Effectiveness metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">False Positives</h4>
                  <span className="text-sm font-medium">3.2%</span>
                </div>
                <Progress value={3.2} className="h-2" />
                <p className="mt-1 text-xs text-muted-foreground">Legitimate content incorrectly flagged</p>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">False Negatives</h4>
                  <span className="text-sm font-medium">1.5%</span>
                </div>
                <Progress value={1.5} className="h-2" />
                <p className="mt-1 text-xs text-muted-foreground">Violations that weren't caught</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">User Appeals</h4>
                  <span className="text-sm font-medium">2.8%</span>
                </div>
                <Progress value={2.8} className="h-2" />
                <p className="mt-1 text-xs text-muted-foreground">Of moderation actions appealed</p>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Appeals Granted</h4>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <Progress value={42} className="h-2" />
                <p className="mt-1 text-xs text-muted-foreground">Of appeals resulted in reversal</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const MetricCard = ({ title, value, change, icon, description }: { title: string, value: string, change: string, icon: React.ReactNode, description: string }) => {
  const isPositive = change.startsWith("+") || (change.startsWith("-") && title === "Avg. Response Time")

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

const FlaggedContent = ({ user, platform, content, reason, time, severity }: { user: { name: string, handle: string, avatar: string }, platform: string, content: string, reason: string, time: string, severity: string }) => {
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

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <p className="font-medium">{user.name}</p>
              <span className="ml-2 text-sm text-muted-foreground">{user.handle}</span>
              <Badge variant="outline" className={`ml-2 ${getPlatformColor(platform)}`}>
                {platform}
              </Badge>
            </div>
            <p className="mt-1 text-sm">{content}</p>
          </div>
        </div>
        <Badge className={getSeverityColor(severity)}>{severity}</Badge>
      </div>
      <div className="mt-2 flex items-center justify-between border-t pt-2 text-sm">
        <span className="text-muted-foreground">Reason: {reason}</span>
        <span className="text-muted-foreground">{time}</span>
      </div>
      <div className="mt-2 flex space-x-2">
        <Badge
          variant="outline"
          className="cursor-pointer bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700"
        >
          Approve
        </Badge>
        <Badge
          variant="outline"
          className="cursor-pointer bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700"
        >
          Remove
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Review Later
        </Badge>
      </div>
    </div>
  )
}

const SuspiciousUser = ({ name, joinDate, flags, reason, risk }: { name: string, joinDate: string, flags: number, reason: string, risk: string }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
          <User className="h-5 w-5 text-amber-700 dark:text-amber-300" />
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">Joined: {joinDate}</p>
        </div>
      </div>
      <div className="text-right">
        <Badge className={getRiskColor(risk)}>{risk} Risk</Badge>
        <div className="mt-1 text-xs">
          <span className="text-muted-foreground">
            {flags} flags • {reason}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ModerationMetrics
