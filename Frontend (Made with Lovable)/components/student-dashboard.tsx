"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  GraduationCap,
  Star,
  Target,
  TrendingUp,
  Award,
  PlayCircle,
  Download,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const performanceData = [
  { week: "Week 1", score: 75, assignments: 3 },
  { week: "Week 2", score: 82, assignments: 4 },
  { week: "Week 3", score: 78, assignments: 2 },
  { week: "Week 4", score: 88, assignments: 5 },
  { week: "Week 5", score: 92, assignments: 3 },
  { week: "Week 6", score: 85, assignments: 4 },
]

const skillsData = [
  { skill: "Formulas", progress: 85, level: "Advanced" },
  { skill: "Charts", progress: 72, level: "Intermediate" },
  { skill: "Pivot Tables", progress: 45, level: "Beginner" },
  { skill: "Data Analysis", progress: 68, level: "Intermediate" },
  { skill: "Macros", progress: 25, level: "Beginner" },
]

const assignments = [
  {
    id: 1,
    title: "Sales Data Analysis",
    subject: "Business Analytics",
    dueDate: "2024-01-15",
    status: "completed",
    score: 92,
    difficulty: "Medium",
  },
  {
    id: 2,
    title: "Budget Planning Spreadsheet",
    subject: "Financial Management",
    dueDate: "2024-01-18",
    status: "in-progress",
    score: null,
    difficulty: "Hard",
  },
  {
    id: 3,
    title: "Inventory Tracking System",
    subject: "Operations Management",
    dueDate: "2024-01-22",
    status: "pending",
    score: null,
    difficulty: "Easy",
  },
  {
    id: 4,
    title: "Customer Survey Analysis",
    subject: "Marketing Research",
    dueDate: "2024-01-25",
    status: "pending",
    score: null,
    difficulty: "Medium",
  },
]

const studyMaterials = [
  {
    id: 1,
    title: "Advanced Excel Formulas",
    type: "video",
    duration: "45 min",
    completed: true,
  },
  {
    id: 2,
    title: "Creating Dynamic Charts",
    type: "tutorial",
    duration: "30 min",
    completed: false,
  },
  {
    id: 3,
    title: "Pivot Table Mastery",
    type: "interactive",
    duration: "60 min",
    completed: false,
  },
  {
    id: 4,
    title: "Data Validation Techniques",
    type: "document",
    duration: "15 min",
    completed: true,
  },
]

export default function StudentDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600"
      case "Medium":
        return "text-yellow-600"
      case "Hard":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back, Student!</h2>
            <p className="text-muted-foreground mt-1">Continue your Excel learning journey. You're doing great!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">85%</div>
              <div className="text-xs text-muted-foreground">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                    <p className="text-xl font-bold">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Soon</p>
                    <p className="text-xl font-bold">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Score</p>
                    <p className="text-xl font-bold">87%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Upcoming */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignments
                  .filter((a) => a.status !== "completed")
                  .slice(0, 3)
                  .map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{assignment.title}</h4>
                        <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">{assignment.dueDate}</p>
                        <Badge variant="outline" className={`text-xs ${getDifficultyColor(assignment.difficulty)}`}>
                          {assignment.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">My Assignments</h3>
            <div className="flex gap-2">
              <Badge variant="outline">4 Total</Badge>
              <Badge variant="default">1 Completed</Badge>
            </div>
          </div>

          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(assignment.status)}`} />
                        <h4 className="font-medium">{assignment.title}</h4>
                        <Badge variant="outline" className={getDifficultyColor(assignment.difficulty)}>
                          {assignment.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{assignment.subject}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Due: {assignment.dueDate}</span>
                        {assignment.score && (
                          <span className="text-green-600 font-medium">Score: {assignment.score}%</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {assignment.status === "completed" ? (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      ) : (
                        <Button size="sm">{assignment.status === "in-progress" ? "Continue" : "Start"}</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Skill Progress
                </CardTitle>
                <CardDescription>Track your Excel skills development</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillsData.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.skill}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {skill.level}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                      </div>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <p className="text-sm font-medium">First Assignment</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium">Quick Learner</p>
                    <p className="text-xs text-muted-foreground">5 in a row</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium">Perfect Score</p>
                    <p className="text-xs text-muted-foreground">100% on test</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg opacity-50">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <GraduationCap className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="text-sm font-medium">Excel Master</p>
                    <p className="text-xs text-muted-foreground">Locked</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Study Materials</h3>
            <Badge variant="outline">
              {studyMaterials.filter((m) => m.completed).length} of {studyMaterials.length} completed
            </Badge>
          </div>

          <div className="grid gap-4">
            {studyMaterials.map((material) => (
              <Card key={material.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          material.completed ? "bg-green-100 dark:bg-green-900/20" : "bg-muted"
                        }`}
                      >
                        {material.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{material.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs capitalize">
                            {material.type}
                          </Badge>
                          <span>{material.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant={material.completed ? "outline" : "default"}>
                      {material.completed ? "Review" : "Start"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
