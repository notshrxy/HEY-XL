"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  GraduationCap,
  BookOpen,
  BarChart3,
  Settings,
  Moon,
  Sun,
  MessageSquare,
  LayoutDashboard,
  Zap,
  Send,
  Loader2,
  Paperclip,
} from "lucide-react"
import { useTheme } from "next-themes"
import AnimatedBackground from "@/components/animated-background"

// Dashboard Component - Contains a visually appealing dashboard for students and lecturers
const Dashboard = ({ userRole }: { userRole: "student" | "lecturer" }) => {
  return (
    <div className="space-y-8 p-8 bg-black/20 rounded-2xl border border-white/10 shadow-lg">
      <div className="flex justify-between items-center pb-4 border-b border-gray-700/50">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-white bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-shift-fast">
            Welcome back, {userRole === "student" ? "Student" : "Lecturer"}!
          </h2>
          <p className="text-gray-400">Continue your Excel learning journey. You're doing great!</p>
        </div>
        <div className="flex items-center gap-4 text-center">
          <Card className="glass-interactive border-white/20 px-6 py-4 rounded-xl shadow-lg transform-gpu hover:scale-105 transition-all duration-300 hover:shadow-purple-500/25">
            <h3 className="text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-glow">
              85%
            </h3>
            <p className="text-xs text-gray-400 mt-1">Overall Progress</p>
          </Card>
          <Card className="glass-interactive border-white/20 px-6 py-4 rounded-xl shadow-lg transform-gpu hover:scale-105 transition-all duration-300 hover:shadow-blue-500/25">
            <h3 className="text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 animate-glow">
              12
            </h3>
            <p className="text-xs text-gray-400 mt-1">Completed</p>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-interactive border-white/20 p-6 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-white text-lg font-semibold">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <h3 className="text-4xl font-bold text-blue-400">3</h3>
          </CardContent>
        </Card>
        <Card className="glass-interactive border-white/20 p-6 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-white text-lg font-semibold">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <h3 className="text-4xl font-bold text-green-400">12</h3>
          </CardContent>
        </Card>
        <Card className="glass-interactive border-white/20 p-6 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-white text-lg font-semibold">
              Due Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <h3 className="text-4xl font-bold text-orange-400">2</h3>
          </CardContent>
        </Card>
        <Card className="glass-interactive border-white/20 p-6 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-white text-lg font-semibold">
              Avg Score
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <h3 className="text-4xl font-bold text-purple-400">87%</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <Card className="glass-interactive border-white/20 p-6 rounded-2xl shadow-lg">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <div>
                <p className="text-sm font-medium text-white">Budget Planning</p>
                <p className="text-xs text-gray-400">Financial Analysis</p>
              </div>
              <p className="text-sm text-gray-300">2024-01-18</p>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <div>
                <p className="text-sm font-medium text-white">Inventory Tracking</p>
                <p className="text-xs text-gray-400">Operations Management</p>
              </div>
              <p className="text-sm text-gray-300">2024-01-22</p>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm font-medium text-white">Customer Survey Analysis</p>
                <p className="text-xs text-gray-400">Market Research</p>
              </div>
              <p className="text-sm text-gray-300">2024-01-25</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-interactive border-white/20 p-6 rounded-2xl shadow-lg">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-red-400" />
              Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <canvas id="performance-chart" className="w-full h-48"></canvas>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


// Voice Chat Interface Component
const VoiceChatInterface = ({ userRole }: { userRole: "student" | "lecturer" }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm your Excel Voice Assistant. How can I help you today?",
    },
  ])
  const [inputMode, setInputMode] = useState("text")
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const newMessage = { role: "user", text: inputText }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInputText("")
    setIsLoading(true)

    // System prompt for the LLM
    const systemPrompt = `You are HEY-XL, a specialized AI assistant for Excel and spreadsheet tasks. Your persona is a helpful, intelligent, and slightly playful guide. Your primary function is to assist users with Excel-related queries.
    
    If a user asks a question that is clearly an Excel task (e.g., "How do I create a pivot table?", "Write a formula to sum column A", "Can you analyze this data?"), provide a direct, concise, and helpful response. Be specific and provide clear instructions or code snippets. You should sound professional and knowledgeable in this case.

    If a user's query is conversational or non-Excel related (e.g., "Hello", "How are you?", "What's the weather like?"), respond in a friendly and engaging manner, but gently redirect the conversation back to Excel. For example, "I'm doing great, thanks for asking! My purpose is to help with Excel. What spreadsheet challenge are you facing today?" This helps maintain your persona and focus.

    Ensure all your responses are in markdown and are well-formatted. Use bullet points, bold text, and code blocks for clarity where appropriate. Keep your responses concise unless a detailed explanation is required.`

    const userQuery = inputText

    try {
      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
      };

      const apiKey = "" 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      const assistantResponse = { role: "assistant", text: text || "Sorry, I couldn't process that request." };
      setMessages((prevMessages) => [...prevMessages, assistantResponse]);

    } catch (error) {
      console.error("API call failed:", error);
      setMessages((prevMessages) => [...prevMessages, { role: "assistant", text: "I'm sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleInputMode = () => {
    setInputMode(inputMode === "text" ? "voice" : "text")
  }

  return (
    <div className="flex flex-col h-full bg-black/10 backdrop-blur-sm rounded-b-xl">
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`p-4 rounded-xl max-w-[75%] ${
                msg.role === "user"
                  ? "bg-purple-600/50 text-white shadow-xl glass-interactive hover:scale-105 transition-all duration-300 transform-gpu hover:rotate-1"
                  : "bg-gray-800/80 text-white shadow-xl glass-interactive hover:scale-105 transition-all duration-300 transform-gpu hover:rotate-1"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-white/20 flex items-center gap-2 bg-gray-900/50 backdrop-blur-xl">
        {inputMode === "text" ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleInputMode}
              className="glass-interactive hover:scale-110 transition-all duration-300"
            >
              <Mic className="w-5 h-5 text-white" />
            </Button>
            <Input
              type="text"
              placeholder="Type your Excel query..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 transition-all duration-300 focus:scale-[1.01] focus:bg-white/20 backdrop-blur-sm"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={isLoading}
              className="glass-interactive hover:scale-110 transition-all duration-300"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 h-12 gap-4">
            <span className="text-gray-400">Listening...</span>
            <Button size="icon" className="animate-pulse">
              <Mic className="w-6 h-6" />
            </Button>
            <Button onClick={toggleInputMode} variant="ghost" className="text-sm">
              Use Text Input
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


export default function VoiceExcelAssistant() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"student" | "lecturer" | null>(null)
  const [currentView, setCurrentView] = useState("chat")
  const { theme, setTheme } = useTheme()

  const handleLogin = (role: "student" | "lecturer") => {
    setUserRole(role)
    setIsLoggedIn(true)
    setCurrentView("chat")
  }

  const handleGoogleLogin = () => {
    // Simulate Google OAuth login
    console.log("[v0] Google OAuth login initiated")
    setUserRole("student") // Default to student for demo
    setIsLoggedIn(true)
    setCurrentView("chat")
  }

  const ThemeToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-6 right-6 z-50 glass-interactive hover:scale-110 transition-all duration-300 animate-glow transform-gpu hover:rotate-12"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )

  const imageAssets = [
    {
      src: "/voice-command-interface-with-microphone-and-wavefo.jpg",
      alt: "Voice Command Interface Demo",
      title: "Voice Commands",
      description: "Speak naturally to control Excel functions and data manipulation",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      src: "/excel-spreadsheet-with-ai-assistance-and-data-visu.jpg",
      alt: "AI Excel Assistant Demo",
      title: "Smart Analysis",
      description: "AI-powered insights and automated data processing",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      src: "/real-time-collaboration-dashboard-with-multiple-us.jpg",
      alt: "Real-time Collaboration Demo",
      title: "Live Collaboration",
      description: "Work together in real-time with voice-enabled teamwork",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
  ]

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient-shift"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-transparent to-pink-900/30 animate-gradient-shift-reverse"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-cyan-900/20 to-transparent animate-gradient-pulse"></div>
        </div>

        <AnimatedBackground />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl animate-float-slow animate-morph"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-lg animate-float-reverse animate-3d-rotate"></div>
          <div
            className="absolute bottom-32 left-40 w-40 h-40 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-2xl animate-float-slow animate-morph"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-orange-500/25 to-red-500/25 rounded-full blur-xl animate-float-reverse animate-3d-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-gradient-to-br from-violet-500/35 to-purple-500/35 rounded-full blur-lg animate-pulse-glow animate-3d-rotate"></div>
          <div
            className="absolute top-1/3 right-1/4 w-36 h-36 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full blur-2xl animate-float-slow animate-morph"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <ThemeToggle />

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl w-full relative z-10">
          <div className="flex flex-col justify-center space-y-8 p-8">
            <div className="space-y-6">
              <h1 className="text-6xl font-bold text-white leading-tight transform-gpu hover:scale-105 transition-all duration-500">
                <span className="block mb-2">
                  <span className="text-white bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text animate-gradient-shift">
                    Elevate Your
                  </span>
                </span>
                <span className="block text-7xl font-black tracking-tight text-white drop-shadow-2xl filter brightness-110 contrast-125 transform-gpu hover:scale-110 hover:rotate-1 transition-all duration-700 text-shadow-bold">
                  Excel Vision
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed transform-gpu hover:scale-105 transition-all duration-300">
                Experience{" "}
                <span className="text-purple-400 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold">
                  revolutionary
                </span>{" "}
                voice-driven Excel assistance through{" "}
                <span className="text-blue-400 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text font-semibold">
                  innovative AI technology
                </span>{" "}
                and cutting-edge interface design.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-4">See It In Action</h3>
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden glass border border-white/10 group">
                <div className="relative w-full h-full">
                  {imageAssets.map((asset, index) => (
                    <div
                      key={index}
                      className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000"
                      style={{
                        animation: `carousel-fade 9s infinite ${index * 3}s`,
                      }}
                    >
                      <img
                        src={asset.src}
                        alt={asset.alt}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${asset.gradient}`}></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm">
                        <h4 className="text-lg font-semibold text-white mb-1">{asset.title}</h4>
                        <p className="text-gray-300 text-sm">{asset.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <style jsx>{`
                @keyframes carousel-fade {
                  0% { opacity: 0; }
                  10% { opacity: 1; }
                  33.33% { opacity: 1; }
                  43.33% { opacity: 0; }
                  100% { opacity: 0; }
                }
              `}</style>
            </div>
          </div>

          <div className="flex items-center justify-center p-8">
            <Card className="bg-slate-800/80 backdrop-blur-xl border border-white/20 shadow-2xl relative z-10 hover:scale-[1.02] transition-all duration-500 transform-gpu hover:shadow-purple-500/25 w-full max-w-md">
              <CardHeader className="space-y-1 text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 animate-glow transform-gpu hover:rotate-12 hover:scale-110 transition-all duration-500">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text animate-gradient-shift transform-gpu hover:scale-105 transition-all duration-300">
                  Sign Up Account
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Enter your personal data to create your account.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Button
                    onClick={handleGoogleLogin}
                    variant="outline"
                    className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm transform-gpu hover:rotate-1 hover:shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm transform-gpu hover:rotate-1 hover:shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-gray-400">Or</span>
                  </div>
                </div>

                <Tabs defaultValue="register" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
                    <TabsTrigger
                      value="register"
                      className="transition-all duration-300 data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 transform-gpu hover:scale-105"
                    >
                      Register
                    </TabsTrigger>
                    <TabsTrigger
                      value="login"
                      className="transition-all duration-300 data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 transform-gpu hover:scale-105"
                    >
                      Sign In
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="register" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Input
                          placeholder="First Name"
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 transition-all duration-300 focus:scale-[1.02] focus:bg-white/20 backdrop-blur-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          placeholder="Last Name"
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 transition-all duration-300 focus:scale-[1.02] focus:bg-white/20 backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    <Input
                      type="email"
                      placeholder="EXAMPLE@FLOWERSANDSAINTS.COM.AU"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 transition-all duration-300 focus:scale-[1.02] focus:bg-white/20 backdrop-blur-sm"
                    />

                    <Input
                      type="password"
                      placeholder="YourBestPassword"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 transition-all duration-300 focus:scale-[1.02] focus:bg-white/20 backdrop-blur-sm"
                    />

                    <p className="text-xs text-gray-400">Must be at least 8 characters.</p>

                    <Select>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white h-12 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800/90 border-white/20 backdrop-blur-xl">
                        <SelectItem value="student" className="text-white hover:bg-white/10">
                          <div className="flex items-center gap-3">
                            <GraduationCap className="w-5 h-5 text-purple-400" />
                            <span className="font-medium">Student</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="lecturer" className="text-white hover:bg-white/10">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-pink-400" />
                            <span className="font-medium">Lecturer</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={() => handleLogin("student")}
                      className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 font-medium transform-gpu hover:rotate-1"
                    >
                      Sign Up
                    </Button>

                    <p className="text-center text-sm text-gray-400">
                      Already have an account?{" "}
                      <button className="text-purple-400 hover:text-purple-300 transition-colors">Log in</button>
                    </p>
                  </TabsContent>

                  <TabsContent value="login" className="space-y-4 mt-6">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 transition-all duration-300 focus:scale-[1.02] focus:bg-white/20 backdrop-blur-sm"
                    />

                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 transition-all duration-300 focus:scale-[1.02] focus:bg-white/20 backdrop-blur-sm"
                    />

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => handleLogin("student")}
                        className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 transform-gpu hover:rotate-1"
                      >
                        <GraduationCap className="w-5 h-5 mr-2" />
                        Student Portal
                      </Button>
                      <Button
                        onClick={() => handleLogin("lecturer")}
                        variant="outline"
                        className="flex-1 h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm transform-gpu hover:rotate-1"
                      >
                        <BookOpen className="w-5 h-5 mr-2" />
                        Lecturer Portal
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950 animate-gradient-shift"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/40 via-transparent to-pink-950/40 animate-gradient-shift-reverse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-cyan-950/30 to-transparent animate-gradient-pulse"></div>
      </div>

      <AnimatedBackground />

      <header className="glass border-b border-white/20 sticky top-0 z-40 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center animate-glow transform-gpu hover:rotate-12 hover:scale-110 transition-all duration-500">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-primary bg-gradient-to-r from-primary via-accent to-primary bg-clip-text animate-gradient-shift transform-gpu hover:scale-105 transition-all duration-300">
                HEY-XL
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back,{" "}
                <span className="text-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text font-semibold">
                  {userRole === "student" ? "Student" : "Lecturer"}
                </span>{" "}
                ✨
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={currentView === "chat" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("chat")}
                className="transition-all duration-300 hover:scale-105 transform-gpu hover:rotate-1"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button
                variant={currentView === "dashboard" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("dashboard")}
                className="transition-all duration-300 hover:scale-105 transform-gpu hover:rotate-1"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>

            <Badge
              variant={userRole === "student" ? "default" : "secondary"}
              className="capitalize glass-interactive border-0 px-3 py-1 hover:scale-105 transition-all duration-300 transform-gpu hover:rotate-1"
            >
              {userRole === "student" ? (
                <>
                  <GraduationCap className="w-3 h-3 mr-1" /> Student
                </>
              ) : (
                <>
                  <BookOpen className="w-3 h-3 mr-1" /> Lecturer
                </>
              )}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="hover:scale-110 transition-all duration-300 transform-gpu hover:rotate-12"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 relative z-10">
        {currentView === "chat" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Voice Control Panel */}
            <div className="lg:col-span-2">
              <Card className="h-[650px] glass border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform-gpu hover:scale-[1.01]">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center transform-gpu hover:rotate-12 hover:scale-110 transition-all duration-300">
                      <Mic className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-primary bg-gradient-to-r from-primary via-accent to-primary bg-clip-text animate-gradient-shift transform-gpu hover:scale-105 transition-all duration-300">
                      Voice Chat Assistant
                    </span>
                  </CardTitle>
                  <CardDescription className="text-base">
                    Interact with your{" "}
                    <span className="text-blue-500 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text font-semibold">
                      Excel assistant
                    </span>{" "}
                    using voice or text commands
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 h-[calc(100%-6rem)]">
                  <VoiceChatInterface userRole={userRole!} />
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats Panel */}
            <div className="space-y-6">
              <Card className="glass-interactive border-white/20 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform-gpu bg-gradient-to-br from-gray-900/50 to-gray-800/50">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/30 transform-gpu hover:rotate-12 transition-transform duration-300">
                      <BarChart3 className="w-3 h-3 text-white" />
                    </div>
                    Accuracy Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-xl glass-interactive hover:scale-105 transition-all duration-300 shadow-lg border border-white/10">
                    <span className="text-sm font-semibold text-emerald-100">Voice Recognition</span>
                    <span className="font-bold text-emerald-300 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-xl">
                      94%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl glass-interactive hover:scale-105 transition-all duration-300 shadow-lg border border-white/10">
                    <span className="text-sm font-semibold text-green-100">Command Success</span>
                    <span className="font-bold text-green-300 bg-gradient-to-r from-green-300 to-teal-300 bg-clip-text text-xl">
                      89%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl glass-interactive hover:scale-105 transition-all duration-300 shadow-lg border border-white/10">
                    <span className="text-sm font-semibold text-teal-100">Response Time</span>
                    <span className="font-bold text-teal-300 bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-xl">
                      1.2s
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-interactive border-white/20 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform-gpu bg-gradient-to-br from-gray-900/50 to-gray-800/50">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg shadow-purple-500/30 transform-gpu hover:rotate-12 transition-transform duration-300">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  {userRole === "student" ? (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] transform-gpu hover:shadow-purple-500/20 shadow-lg"
                      >
                        📊 My Assignments
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] transform-gpu hover:shadow-pink-500/20 shadow-lg"
                      >
                        📈 Grade Tracker
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] transform-gpu hover:shadow-violet-500/20 shadow-lg"
                      >
                        📚 Study Materials
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] transform-gpu hover:shadow-indigo-500/20 shadow-lg"
                      >
                        🎯 Practice Exercises
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] transform-gpu hover:shadow-purple-500/20 shadow-lg"
                      >
                        👥 Class Management
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] transform-gpu hover:shadow-pink-500/20 shadow-lg"
                      >
                        📋 Assignment Creator
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] transform-gpu hover:shadow-violet-500/20 shadow-lg"
                      >
                        📊 Student Analytics
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] transform-gpu hover:shadow-indigo-500/20 shadow-lg"
                      >
                        🎓 Gradebook
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div>{userRole && <Dashboard userRole={userRole} />}</div>
        )}
      </main>
    </div>
  )
}