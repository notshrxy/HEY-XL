"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Clock,
  FileSpreadsheet,
  GraduationCap,
  Star,
  Target,
  TrendingUp,
  Download,
  Plus,
  Edit,
  Eye,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const classPerformanceData = [
  { week: "Week 1", avgScore: 72, submissions: 28 },
  { week: "Week 2", avgScore: 78, submissions: 30 },
  { week: "Week 3", avgScore: 75, submissions: 27 },
  { week: "Week 4", avgScore: 82, submissions: 29 },
  { week: "Week 5", avgScore: 85, submissions: 31 },
  { week: "Week 6", avgScore: 88, submissions: 30 },
]

const skillDistribution = [
  { skill: "Formulas", students: 25, color: "#8b5cf6" },
  { skill: "Charts", students: 18, color: "#06b6d4" },
  { skill: "Pivot Tables", students: 12, color: "#10b981" },
  { skill: "Data Analysis", students: 20, color: "#f59e0b" },
  { skill: "Macros", students: 8, color: "#ef4444" },
]

const assignments = [
  {
    id: 1,
    title: "Sales Data Analysis",
    class: "Business Analytics 101",
    dueDate: "2024-01-15",
    submissions: 28,
    totalStudents: 30,
    avgScore: 87,
    status: "active",
  },
  {
    id: 2,
    title: "Budget Planning Spreadsheet",
    class: "Financial Management",
    dueDate: "2024-01-18",
    submissions: 15,
    totalStudents: 25,
    avgScore: null,
    status: "active",
  },
  {
    id: 3,
    title: "Inventory Tracking System",
    class: "Operations Management",
    dueDate: "2024-01-22",
    submissions: 0,
    totalStudents: 32,
    avgScore: null,
    status: "draft",
  },
]

const students = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    progress: 92,
    assignments: 12,
    lastActive: "2 hours ago",
  },
  { id: 2, name: "Bob Smith", email: "bob@example.com", progress: 78, assignments: 10, lastActive: "1 day ago" },
  { id: 3, name: "Carol Davis", email: "carol@example.com", progress: 85, assignments: 11, lastActive: "3 hours ago" },
  { id: 4, name: "David Wilson", email: "david@example.com", progress: 65, assignments: 8, lastActive: "2 days ago" },
  { id: 5, name: "Eva Brown", email: "eva@example.com", progress: 94, assignments: 13, lastActive: "1 hour ago" },
]

const classes = [
  { id: 1, name: "Business Analytics 101", students: 30, assignments: 8, avgProgress: 82 },
  { id: 2, name: "Financial Management", students: 25, assignments: 6, avgProgress: 75 },
  { id: 3, name: "Operations Management", students: 32, assignments: 7, avgProgress: 78 },
]

export default function LecturerDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [showCreateAssignment, setShowCreateAssignment] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "draft":
        return "bg-yellow-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "text-green-600"
    if (progress >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back, Professor!</h2>
            <p className="text-muted-foreground mt-1">Manage your classes and track student progress</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">87</div>
              <div className="text-xs text-muted-foreground">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">21</div>
              <div className="text-xs text-muted-foreground">Active Assignments</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-xl font-bold">87</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Assignments</p>
                    <p className="text-xl font-bold">21</p>
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
                    <p className="text-sm text-muted-foreground">Pending Reviews</p>
                    <p className="text-xl font-bold">43</p>
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
                    <p className="text-sm text-muted-foreground">Class Average</p>
                    <p className="text-xl font-bold">82%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Class Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">New submission from Alice Johnson</h4>
                    <p className="text-xs text-muted-foreground">Sales Data Analysis - 2 hours ago</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    New
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Assignment deadline approaching</h4>
                    <p className="text-xs text-muted-foreground">Budget Planning - Due in 2 days</p>
                  </div>
                  <Badge variant="outline" className="text-xs text-yellow-600">
                    Reminder
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Class average improved</h4>
                    <p className="text-xs text-muted-foreground">Business Analytics 101 - +5% this week</p>
                  </div>
                  <Badge variant="outline" className="text-xs text-green-600">
                    Good
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Class Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={classPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgScore" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Assignment Management</h3>
            <Button onClick={() => setShowCreateAssignment(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </div>

          {showCreateAssignment && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">Create New Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Assignment Title</Label>
                    <Input id="title" placeholder="Enter assignment title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id.toString()}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Assignment description and requirements" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">Total Points</Label>
                    <Input id="points" type="number" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button>Create Assignment</Button>
                  <Button variant="outline" onClick={() => setShowCreateAssignment(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(assignment.status)}`} />
                        <h4 className="font-medium">{assignment.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {assignment.class}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>Due: {assignment.dueDate}</span>
                        <span>
                          Submissions: {assignment.submissions}/{assignment.totalStudents}
                        </span>
                        {assignment.avgScore && (
                          <span className="text-green-600 font-medium">Avg: {assignment.avgScore}%</span>
                        )}
                      </div>
                      <Progress
                        value={(assignment.submissions / assignment.totalStudents) * 100}
                        className="h-2 w-32"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {assignment.submissions > 0 && (
                        <Button size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Student Management</h3>
            <div className="flex gap-2">
              <Badge variant="outline">{students.length} Students</Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export List
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {students.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">Progress</p>
                        <p className={`text-lg font-bold ${getProgressColor(student.progress)}`}>{student.progress}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Assignments</p>
                        <p className="text-lg font-bold">{student.assignments}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Last Active</p>
                        <p className="text-sm text-muted-foreground">{student.lastActive}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Skill Distribution
                </CardTitle>
                <CardDescription>Student proficiency across Excel skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={skillDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Assignment Completion
                </CardTitle>
                <CardDescription>Overall completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completed on Time</span>
                    <span className="font-medium text-green-600">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Late Submissions</span>
                    <span className="font-medium text-yellow-600">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Missing</span>
                    <span className="font-medium text-red-600">7%</span>
                  </div>
                  <div className="space-y-2">
                    <Progress value={78} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Class Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{cls.name}</span>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{cls.students} students</span>
                        <span>{cls.assignments} assignments</span>
                        <span className="font-medium">{cls.avgProgress}%</span>
                      </div>
                    </div>
                    <Progress value={cls.avgProgress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Class Management</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Class
            </Button>
          </div>

          <div className="grid gap-4">
            {classes.map((cls) => (
              <Card key={cls.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{cls.name}</h4>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{cls.students}</div>
                          <div className="text-xs text-muted-foreground">Students</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{cls.assignments}</div>
                          <div className="text-xs text-muted-foreground">Assignments</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{cls.avgProgress}%</div>
                          <div className="text-xs text-muted-foreground">Avg Progress</div>
                        </div>
                      </div>
                      <Progress value={cls.avgProgress} className="h-2" />
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                    </div>
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
