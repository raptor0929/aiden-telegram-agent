"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart } from "@/components/ui/charts"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, FileText, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"

const ContentSchedulingMetrics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Scheduling Agent</h1>
          <p className="text-muted-foreground">Plans and coordinates content across platforms</p>
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
          title="Scheduled Posts"
          value="28"
          change="+4"
          icon={<FileText className="h-4 w-4 text-blue-500" />}
          description="Next 7 days"
        />
        <MetricCard
          title="Optimal Time Accuracy"
          value="94.3%"
          change="+2.1%"
          icon={<Clock className="h-4 w-4 text-blue-500" />}
          description="Engagement prediction"
        />
        <MetricCard
          title="Content Pipeline"
          value="85%"
          change="+5%"
          icon={<ArrowUpRight className="h-4 w-4 text-blue-500" />}
          description="Completion rate"
        />
        <MetricCard
          title="Published Today"
          value="5/6"
          change=""
          icon={<CheckCircle2 className="h-4 w-4 text-blue-500" />}
          description="Posts completed"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Optimal Posting Times</CardTitle>
            <CardDescription>Engagement by hour of day</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              className="h-[300px]"
              layout="horizontal"
              data={[
                { hour: "00:00", engagement: 15 },
                { hour: "02:00", engagement: 10 },
                { hour: "04:00", engagement: 5 },
                { hour: "06:00", engagement: 12 },
                { hour: "08:00", engagement: 25 },
                { hour: "10:00", engagement: 40 },
                { hour: "12:00", engagement: 55 },
                { hour: "14:00", engagement: 70 },
                { hour: "16:00", engagement: 85 },
                { hour: "18:00", engagement: 95 },
                { hour: "20:00", engagement: 75 },
                { hour: "22:00", engagement: 45 },
              ]}
              category="engagement"
              index="hour"
              colors={["blue"]}
              valueFormatter={(value: number) => `${value}%`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>By platform and content type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Discord</h4>
                  <span className="text-sm text-muted-foreground">12 posts</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Twitter</h4>
                  <span className="text-sm text-muted-foreground">9 posts</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Telegram</h4>
                  <span className="text-sm text-muted-foreground">5 posts</span>
                </div>
                <Progress value={17} className="h-2" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Blog</h4>
                  <span className="text-sm text-muted-foreground">4 posts</span>
                </div>
                <Progress value={13} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Content Calendar</CardTitle>
            <CardDescription>Upcoming scheduled posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ScheduledPost
                title="Product Update Announcement"
                platform="Discord, Twitter"
                date="Today"
                time="14:30"
                status="Scheduled"
                type="Announcement"
              />
              <ScheduledPost
                title="Community AMA Reminder"
                platform="All Platforms"
                date="Today"
                time="17:00"
                status="Scheduled"
                type="Event"
              />
              <ScheduledPost
                title="Weekly Dev Update"
                platform="Blog, Discord"
                date="Tomorrow"
                time="10:00"
                status="Draft"
                type="Update"
              />
              <ScheduledPost
                title="Feature Spotlight: AI Integration"
                platform="Twitter, Telegram"
                date="Jun 14"
                time="12:00"
                status="Draft"
                type="Feature"
              />
              <ScheduledPost
                title="User Showcase: Community Projects"
                platform="Discord, Blog"
                date="Jun 15"
                time="15:00"
                status="Planned"
                type="Community"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly View</CardTitle>
            <CardDescription>Content distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              className="rounded-md border"
              selected={new Date()}
              disabled={{ before: new Date() }}
              modifiers={{
                booked: [
                  new Date(),
                  new Date(new Date().setDate(new Date().getDate() + 1)),
                  new Date(new Date().setDate(new Date().getDate() + 3)),
                  new Date(new Date().setDate(new Date().getDate() + 5)),
                  new Date(new Date().setDate(new Date().getDate() + 7)),
                  new Date(new Date().setDate(new Date().getDate() + 10)),
                  new Date(new Date().setDate(new Date().getDate() + 12)),
                  new Date(new Date().setDate(new Date().getDate() + 14)),
                ],
              }}
              modifiersStyles={{
                booked: { backgroundColor: "hsl(var(--primary))", color: "white" },
              }}
            />
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-primary"></div>
                  <span>Scheduled Content</span>
                </div>
                <span className="font-medium">28 posts</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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
        {change && (
          <div className={`mt-1 flex items-center text-xs ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const ScheduledPost = ({ title, platform, date, time, status, type }: { title: string, platform: string, date: string, time: string, status: string, type: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
      case "Draft":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
      case "Planned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Announcement":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
      case "Event":
        return "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100"
      case "Update":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100"
      case "Feature":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100"
      case "Community":
        return "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-start space-x-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <CalendarIcon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{platform}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className={getTypeColor(type)}>
          {type}
        </Badge>
        <Badge variant="outline" className={getStatusColor(status)}>
          {status}
        </Badge>
        <div className="text-right">
          <p className="font-medium">{date}</p>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
      </div>
    </div>
  )
}

export default ContentSchedulingMetrics
