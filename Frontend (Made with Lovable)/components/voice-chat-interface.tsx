"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  type: "text" | "voice"
}

interface VoiceChatInterfaceProps {
  userRole: "student" | "lecturer"
}

export default function VoiceChatInterface({ userRole }: VoiceChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your Excel Voice Assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentTranscription, setCurrentTranscription] = useState("")
  const [textInput, setTextInput] = useState("")
  const [showTextInput, setShowTextInput] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [voiceIntensity, setVoiceIntensity] = useState(0)
  const [glowColor, setGlowColor] = useState("#8b5cf6")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const voiceVisualizerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isListening || isSpeaking) {
      interval = setInterval(() => {
        const intensity = Math.random() * 100
        setVoiceIntensity(intensity)

        // Change glow color based on intensity
        if (intensity > 80) {
          setGlowColor("#ec4899") // Pink for high intensity
        } else if (intensity > 50) {
          setGlowColor("#8b5cf6") // Purple for medium
        } else {
          setGlowColor("#06b6d4") // Cyan for low
        }
      }, 100)
    } else {
      setVoiceIntensity(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isListening, isSpeaking])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateVoiceRecognition = () => {
    const sampleCommands = [
      "Create a new spreadsheet for monthly sales data",
      "Show me the average of column B",
      "Generate a chart from the selected data",
      "Calculate the sum of quarterly revenue",
      "Format the table with borders and colors",
    ]

    const command = sampleCommands[Math.floor(Math.random() * sampleCommands.length)]
    setCurrentTranscription(command)

    setTimeout(() => {
      handleVoiceCommand(command)
    }, 2000)
  }

  const handleVoiceCommand = (command: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: command,
      sender: "user",
      timestamp: new Date(),
      type: "voice",
    }

    setMessages((prev) => [...prev, newUserMessage])
    setIsListening(false)
    setIsProcessing(true)
    setCurrentTranscription("")

    // Simulate processing and response
    setTimeout(() => {
      setIsProcessing(false)
      setIsSpeaking(true)

      const responses = [
        "I've created a new spreadsheet with the monthly sales data template. You can start entering your data in column A for dates and column B for sales amounts.",
        "The average of column B is $2,450. I've highlighted the result in cell B15 for you.",
        "I've generated a bar chart from your selected data. The chart shows a clear upward trend in your quarterly performance.",
        "The sum of quarterly revenue is $98,750. This represents a 15% increase from last quarter.",
        "I've applied professional formatting to your table with alternating row colors and border styling.",
      ]

      const response = responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "assistant",
        timestamp: new Date(),
        type: "voice",
      }

      setMessages((prev) => [...prev, assistantMessage])

      setTimeout(() => {
        setIsSpeaking(false)
      }, 3000)
    }, 1500)
  }

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      setCurrentTranscription("")
    } else {
      setIsListening(true)
      setShowTextInput(false)
      simulateVoiceRecognition()
    }
  }

  const handleTextSubmit = () => {
    if (!textInput.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: textInput,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, newMessage])
    setTextInput("")
    setShowTextInput(false)

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your request. Let me help you with that Excel task.",
        sender: "assistant",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-full opacity-80"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            background: `
              radial-gradient(ellipse 120% 100% at center bottom, 
                rgba(59, 130, 246, 0.4) 0%,
                rgba(37, 99, 235, 0.3) 20%,
                rgba(29, 78, 216, 0.2) 40%,
                rgba(30, 64, 175, 0.1) 60%,
                rgba(30, 58, 138, 0.05) 80%,
                transparent 100%
              )
            `,
            filter: "blur(1px)",
          }}
        />

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-3/4 opacity-60"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{
            background: `
              radial-gradient(ellipse 100% 80% at center bottom, 
                rgba(96, 165, 250, 0.3) 0%,
                rgba(59, 130, 246, 0.2) 30%,
                rgba(37, 99, 235, 0.1) 60%,
                transparent 100%
              )
            `,
            filter: "blur(2px)",
          }}
        />

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/2 opacity-40"
          animate={{
            scale: [0.9, 1.2, 0.9],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at center bottom, 
                rgba(147, 197, 253, 0.4) 0%,
                rgba(96, 165, 250, 0.2) 40%,
                transparent 100%
              )
            `,
            filter: "blur(3px)",
          }}
        />

        {/* Voice-responsive dynamic aura */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2/3 transition-all duration-150 ease-out"
          style={{
            background: `
              radial-gradient(ellipse ${80 + voiceIntensity * 0.4}% ${60 + voiceIntensity * 0.3}% at center bottom, 
                ${glowColor}${Math.floor(voiceIntensity * 0.3 + 20)
                  .toString(16)
                  .padStart(2, "0")} 0%,
                ${glowColor}${Math.floor(voiceIntensity * 0.2 + 10)
                  .toString(16)
                  .padStart(2, "0")} 30%,
                transparent 70%
              )
            `,
            filter: `blur(${voiceIntensity * 0.05 + 2}px)`,
            opacity: isListening || isSpeaking ? 0.8 : 0.3,
          }}
        />

        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-32 right-16 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-lg"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1.1, 0.9, 1.1],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-blue-400/8 to-cyan-400/8 rounded-full blur-2xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10"
        style={{
          background: `
            linear-gradient(to bottom, 
              rgba(0, 0, 0, 0.1) 0%,
              rgba(0, 0, 0, 0.05) 50%,
              transparent 100%
            )
          `,
          backdropFilter: "blur(0.5px)",
        }}
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: message.sender === "user" ? 50 : -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: message.sender === "user" ? 50 : -50, scale: 0.9 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${message.sender === "user" ? "ml-16" : "mr-16"}`}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Card
                    className={`${
                      message.sender === "user"
                        ? "bg-gradient-to-br from-purple-500/90 to-pink-500/90 text-white border-purple-300/30 shadow-lg shadow-purple-500/25"
                        : "glass-card border-white/20 shadow-lg shadow-blue-500/10"
                    } backdrop-blur-xl relative overflow-hidden group`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${
                        message.sender === "user"
                          ? "from-purple-400/20 via-pink-400/20 to-purple-400/20"
                          : "from-blue-400/20 via-cyan-400/20 to-blue-400/20"
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`}
                    ></div>

                    <CardContent className="p-4 relative z-10">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.sender === "user"
                              ? "bg-white/20 text-white"
                              : "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                          }`}
                        >
                          {message.sender === "user" ? (
                            userRole === "student" ? (
                              "🎓"
                            ) : (
                              "👨‍🏫"
                            )
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm leading-relaxed break-words"
                          >
                            {message.content}
                          </motion.p>

                          <div className="flex items-center gap-3 mt-3">
                            <Badge
                              variant={message.type === "voice" ? "default" : "secondary"}
                              className={`text-xs ${
                                message.type === "voice"
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0"
                                  : "bg-white/20 text-current border-white/30"
                              }`}
                            >
                              {message.type === "voice" ? (
                                <>
                                  <Mic className="w-3 h-3 mr-1" /> Voice
                                </>
                              ) : (
                                <>
                                  <Zap className="w-3 h-3 mr-1" /> Text
                                </>
                              )}
                            </Badge>
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {(isProcessing || isSpeaking) && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex justify-start"
            >
              <div className="max-w-[85%] mr-16">
                <Card className="glass-card border-white/20 shadow-xl backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-gradient-shift"></div>
                  <CardContent className="p-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white animate-spin" />
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {isProcessing ? "Processing your request..." : "Speaking response..."}
                        </span>
                        {isSpeaking && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <Volume2 className="w-4 h-4 text-purple-500" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      <AnimatePresence>
        {(isListening || currentTranscription) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-20"
          >
            <Card className="glass-card border-white/30 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 animate-gradient-shift"></div>
              <CardContent className="p-8 text-center relative z-10">
                <div className="space-y-6">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center mx-auto relative"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
                    <Mic className="w-10 h-10 text-white relative z-10" />
                  </motion.div>

                  {currentTranscription ? (
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-sm text-muted-foreground font-medium">Recognized:</p>
                      <p className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-relaxed">
                        {currentTranscription}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="space-y-3"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Listening...
                      </p>
                      <p className="text-sm text-muted-foreground">Speak clearly into your microphone</p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-0"
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          background: `
            radial-gradient(ellipse 90% 100% at center bottom, 
              ${glowColor}${Math.floor(voiceIntensity * 0.4 + 15)
                .toString(16)
                .padStart(2, "0")} 0%,
              ${glowColor}${Math.floor(voiceIntensity * 0.2 + 8)
                .toString(16)
                .padStart(2, "0")} 40%,
              transparent 80%
            )
          `,
          filter: `blur(${voiceIntensity * 0.2 + 8}px)`,
          transform: `
            scaleY(${voiceIntensity * 0.015 + 0.7}) 
            scaleX(${voiceIntensity * 0.008 + 0.9})
          `,
        }}
      />

      <div
        className="border-t border-white/5 backdrop-blur-xl p-6 relative z-10"
        style={{
          background: `
            linear-gradient(to top, 
              rgba(0, 0, 0, 0.3) 0%,
              rgba(0, 0, 0, 0.1) 100%
            )
          `,
        }}
      >
        <AnimatePresence>
          {showTextInput && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="flex gap-3">
                <Input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your Excel command here..."
                  className="flex-1 glass-interactive border-white/20 bg-white/5 backdrop-blur-sm h-12 text-base placeholder:text-muted-foreground/70 focus:bg-white/10 transition-all duration-300"
                  onKeyPress={(e) => e.key === "Enter" && handleTextSubmit()}
                />
                <Button
                  onClick={handleTextSubmit}
                  size="icon"
                  className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="text-sm px-3 py-1 glass-interactive border-white/20 bg-white/5 backdrop-blur-sm"
            >
              {isListening ? "🎙️ Listening" : isProcessing ? "⌛ Processing" : isSpeaking ? "🔊 Speaking" : "💬 Ready"}
            </Badge>

            {!isListening && !isProcessing && !isSpeaking && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTextInput(!showTextInput)}
                className="text-sm glass-interactive hover:bg-white/10 transition-all duration-300"
              >
                {showTextInput ? "Hide Text Input" : "Use Text Input"}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="text-muted-foreground hover:text-foreground glass-interactive hover:bg-white/10 transition-all duration-300"
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={isListening ? () => setIsListening(false) : toggleListening}
                disabled={isProcessing}
                size="lg"
                className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-300 relative overflow-hidden ${
                  isListening
                    ? "bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse"
                    : "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/50"
                }`}
                style={{
                  boxShadow: isListening
                    ? `0 0 ${voiceIntensity * 0.5 + 20}px ${glowColor}80, 0 0 ${voiceIntensity * 0.3 + 10}px ${glowColor}40`
                    : undefined,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                <motion.div
                  animate={isListening ? { rotate: 360 } : {}}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="relative z-10"
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
