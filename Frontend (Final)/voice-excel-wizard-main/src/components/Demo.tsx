import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Upload, Download, RotateCcw, Send, Play, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from "xlsx";

// Live Preview backend base URL (Flask server)
const LIVE_PREVIEW_BASE = "http://127.0.0.1:8000";
// Voice controller is merged into the same server (8000)
const VOICE_BACKEND_BASE = LIVE_PREVIEW_BASE;

interface Student {
  name: string;
  dsa: string;
  web: string;
  ml: string;
  attendance: string;
}

interface Message {
  type: "user" | "system";
  text: string;
  timestamp: Date;
}

const Demo = () => {
  const [students, setStudents] = useState<Student[]>([
    { name: "Priya Sharma", dsa: "78", web: "82", ml: "90", attendance: "95%" },
    { name: "Rahul Kumar", dsa: "85", web: "88", ml: "82", attendance: "92%" },
    { name: "Ananya Singh", dsa: "92", web: "90", ml: "88", attendance: "98%" },
    { name: "Arjun Patel", dsa: "76", web: "79", ml: "84", attendance: "88%" },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { type: "system", text: "👋 Welcome! Click 'Start' to begin the backend, then upload a file and use voice commands", timestamp: new Date() }
  ]);

  const [command, setCommand] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [highlightedCell, setHighlightedCell] = useState<{ row: number; col: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [uploadedTable, setUploadedTable] = useState<{ headers: (string | number)[]; rows: (string | number)[][] } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // UI-only demo states (no backend wiring)
  const [backendRunning, setBackendRunning] = useState(false);
  const [backendReadyForFile, setBackendReadyForFile] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [voiceReady, setVoiceReady] = useState(true);
  const [isStartingBackend, setIsStartingBackend] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  // Auto-scroll whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Start backend handler
  const handleStartBackend = async () => {
    setIsStartingBackend(true);
    try {
      const resp = await fetch(`${LIVE_PREVIEW_BASE}/api/session/start`, { method: "POST" });
      const data = await resp.json();
      if (data?.sessionId) {
        setSessionId(data.sessionId);
        setBackendRunning(true);
        setBackendReadyForFile(true);
        setMessages(prev => [...prev, { type: "system", text: `✅ Live Preview session started (${data.sessionId}).`, timestamp: new Date() }]);
      } else {
        setMessages(prev => [...prev, { type: "system", text: "❌ Failed to start Live Preview session.", timestamp: new Date() }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { type: "system", text: "❌ Could not reach Live Preview server at 127.0.0.1:8000.", timestamp: new Date() }]);
    } finally {
      setIsStartingBackend(false);
    }
  };

  // Preview button handler -> opens Flask live preview page
  const handlePreview = () => {
    if (!sessionId) {
      setMessages(prev => [...prev, { type: "system", text: "⚠️ Start the backend first.", timestamp: new Date() }]);
      return;
    }
    const url = `${LIVE_PREVIEW_BASE}/api/session/preview?sessionId=${encodeURIComponent(sessionId)}`;
    setPreviewUrl(url);
    window.open(url, "_blank");
  };

  const onUploadClick = () => fileInputRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Ensure we have a backend session for live preview
    if (!sessionId) {
      try {
        const resp = await fetch(`${LIVE_PREVIEW_BASE}/api/session/start`, { method: "POST" });
        const data = await resp.json();
        if (data?.sessionId) {
          setSessionId(data.sessionId);
          setBackendRunning(true);
          setBackendReadyForFile(true);
        }
      } catch {}
    }

    setIsUploading(true);
    setMessages(prev => [...prev, { type: "system", text: `📄 Uploading ${file.name}...`, timestamp: new Date() }]);

    // Parse sheet and load into the on-page table
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      const sheetName = wb.SheetNames[0];
      if (sheetName) {
        const sheet = wb.Sheets[sheetName];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (rows && rows.length > 0) {
          const headers = rows[0] as (string | number)[];
          const dataRows = rows.slice(1) as (string | number)[][];
          setUploadedTable({ headers, rows: dataRows });
        }
      }
    } catch {
      // ignore preview errors; continue with upload
    }

    try {
      // Upload file to Flask live preview
      if (sessionId) {
        const form = new FormData();
        form.append("file", file);
        const resp = await fetch(`${LIVE_PREVIEW_BASE}/api/session/upload?sessionId=${encodeURIComponent(sessionId)}`, {
          method: "POST",
          body: form
        });
        const data = await resp.json();
        if (data?.success) {
          setMessages(prev => [...prev, { type: "system", text: "✅ File uploaded to Live Preview server.", timestamp: new Date() }]);
          setPreviewUrl(`${LIVE_PREVIEW_BASE}/api/session/preview?sessionId=${encodeURIComponent(sessionId)}`);
          setPreviewReady(true);
        } else if (data?.error) {
          setMessages(prev => [...prev, { type: "system", text: `❌ Upload failed: ${data.error}`, timestamp: new Date() }]);
        }
      }
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const processCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase();
    
    // Add marks pattern: "add [number] for [name] in [subject]"
    const addMarksMatch = lowerCmd.match(/add (\d+) for (\w+) in (\w+)/);
    if (addMarksMatch) {
      const [, marks, name, subject] = addMarksMatch;
      const studentIndex = students.findIndex(s => s.name.toLowerCase().includes(name));
      
      if (studentIndex !== -1) {
        const subjectKey = subject.toLowerCase() as keyof Omit<Student, "name" | "attendance">;
        if (students[studentIndex][subjectKey] !== undefined) {
          const updatedStudents = [...students];
          updatedStudents[studentIndex] = { ...updatedStudents[studentIndex], [subjectKey]: marks };
          setStudents(updatedStudents);
          setHighlightedCell({ row: studentIndex, col: subjectKey });
          setTimeout(() => setHighlightedCell(null), 2000);
          
          setMessages(prev => [...prev, 
            { type: "user", text: cmd, timestamp: new Date() },
            { type: "system", text: `✅ ${students[studentIndex].name}'s ${subject.toUpperCase()} marks updated to ${marks}`, timestamp: new Date() }
          ]);
          return;
        }
      }
    }

    // Mark present/absent pattern
    const attendanceMatch = lowerCmd.match(/mark (\w+) (present|absent)/);
    if (attendanceMatch) {
      const [, name, status] = attendanceMatch;
      const studentIndex = students.findIndex(s => s.name.toLowerCase().includes(name));
      
      if (studentIndex !== -1) {
        const updatedStudents = [...students];
        const currentAttendance = parseInt(updatedStudents[studentIndex].attendance);
        const newAttendance = status === "present" 
          ? Math.min(100, currentAttendance + 2)
          : Math.max(0, currentAttendance - 2);
        updatedStudents[studentIndex].attendance = `${newAttendance}%`;
        setStudents(updatedStudents);
        setHighlightedCell({ row: studentIndex, col: "attendance" });
        setTimeout(() => setHighlightedCell(null), 2000);
        
        setMessages(prev => [...prev,
          { type: "user", text: cmd, timestamp: new Date() },
          { type: "system", text: `✅ ${students[studentIndex].name} marked ${status}. Attendance: ${newAttendance}%`, timestamp: new Date() }
        ]);
        return;
      }
    }

    // If no pattern matched
    setMessages(prev => [...prev,
      { type: "user", text: cmd, timestamp: new Date() },
      { type: "system", text: "❌ Command not recognized. Try: 'Add [marks] for [name] in [subject]' or 'Mark [name] present/absent'", timestamp: new Date() }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = command.trim();
    if (!text) return;
    setMessages(prev => [...prev, { type: "user", text, timestamp: new Date() }]);
    setCommand("");
    try {
      const resp = await fetch(`${VOICE_BACKEND_BASE}/api/voice/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await resp.json();

      if (!resp.ok) {
        setMessages(prev => [...prev, { type: "system", text: `❌ ${data?.error || "Command failed"}` , timestamp: new Date() }]);
        return;
      }

      if (data?.parsed) {
        const p = data.parsed;
        const summary = `Action: ${p.action || "-"}, Name: ${p.name || "-"}, Subject: ${p.subject || "-"}, Value: ${p.value ?? "-"}`;
        setMessages(prev => [...prev, { type: "system", text: `🧠 Parsed → ${summary}`, timestamp: new Date() }]);
      }
      if (data?.steps?.executed) {
        setMessages(prev => [...prev, { type: "system", text: `✅ ${data?.message || "Command executed"}`, timestamp: new Date() }]);
        // Refresh table after execution
        if (sessionId) {
          try {
            const resp2 = await fetch(`${LIVE_PREVIEW_BASE}/api/session/table?sessionId=${encodeURIComponent(sessionId)}`);
            if (resp2.ok) {
              const json = await resp2.json();
              if (json?.headers && json?.rows) {
                setUploadedTable({ headers: json.headers, rows: json.rows });
              }
            }
          } catch {}
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { type: "system", text: `❌ Could not reach backend at ${VOICE_BACKEND_BASE}.`, timestamp: new Date() }]);
    }
  };

  const handleMicClick = async () => {
    setIsListening(true);
    setMessages(prev => [...prev, { type: "system", text: "🎧 Listening for voice...", timestamp: new Date() }]);
    try {
      const resp = await fetch(`${VOICE_BACKEND_BASE}/api/voice/command`, { method: "POST" });
      const data = await resp.json();

      if (!resp.ok) {
        setMessages(prev => [...prev, { type: "system", text: `❌ ${data?.error || "Voice command failed"}`, timestamp: new Date() }]);
        return;
      }

      if (data?.transcript) {
        setMessages(prev => [...prev, { type: "user", text: data.transcript, timestamp: new Date() }]);
      }

      if (data?.speaker) {
        const s = data.speaker;
        setMessages(prev => [...prev, { type: "system", text: `👤 Speaker: ${s.name} (${(s.score*100).toFixed(0)}%)`, timestamp: new Date() }]);
      }

      if (data?.parsed) {
        const p = data.parsed;
        const summary = `Action: ${p.action || "-"}, Name: ${p.name || "-"}, Subject: ${p.subject || "-"}, Value: ${p.value ?? "-"}`;
        setMessages(prev => [...prev, { type: "system", text: `🧠 Parsed → ${summary}`, timestamp: new Date() }]);
      }

      if (data?.steps?.executed) {
        setMessages(prev => [...prev, { type: "system", text: `✅ ${data?.message || "Command executed"}`, timestamp: new Date() }]);

        // Refresh on-page table from backend's latest saved workbook
        if (sessionId) {
          try {
            const resp2 = await fetch(`${LIVE_PREVIEW_BASE}/api/session/table?sessionId=${encodeURIComponent(sessionId)}`);
            if (resp2.ok) {
              const json = await resp2.json();
              if (json?.headers && json?.rows) {
                setUploadedTable({ headers: json.headers, rows: json.rows });
              }
            }
          } catch {}
        }
      } else if (data?.message) {
        setMessages(prev => [...prev, { type: "system", text: `ℹ️ ${data.message}`, timestamp: new Date() }]);
      }

    } catch (e) {
      setMessages(prev => [...prev, { type: "system", text: `❌ Could not reach voice backend at ${VOICE_BACKEND_BASE}.`, timestamp: new Date() }]);
    } finally {
      setIsListening(false);
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 100);
    }
  };

  // Demo reset: confirmation flow removed

  const handleReset = () => {
    setStudents([
      { name: "Priya Sharma", dsa: "78", web: "82", ml: "90", attendance: "95%" },
      { name: "Rahul Kumar", dsa: "85", web: "88", ml: "82", attendance: "92%" },
      { name: "Ananya Singh", dsa: "92", web: "90", ml: "88", attendance: "98%" },
      { name: "Arjun Patel", dsa: "76", web: "79", ml: "84", attendance: "88%" },
    ]);
    setMessages([
      { type: "system", text: "👋 Welcome! Try commands like 'Add 85 for Priya in DSA' or 'Mark Rahul present'", timestamp: new Date() }
    ]);
  };

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 hover-lift text-glow cursor-pointer text-light">Try the Demo</h2>
            <p className="text-xl text-lighter mb-4">
              Experience the voice-controlled Excel assistant in action
            </p>
            <p className="text-sm text-lighter mb-6">
              Upload a file, press the mic, speak your command, and watch it update!
            </p>
            
            {/* Control Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <Button
                onClick={handleStartBackend}
                disabled={backendRunning || isStartingBackend}
                variant={backendRunning ? "default" : "default"}
                size="lg"
                className="min-w-[150px]"
              >
                <Play className="w-4 h-4 mr-2" />
                {isStartingBackend ? "Starting..." : backendRunning ? "Running" : "Start"}
              </Button>
              
              <Button
                onClick={handlePreview}
                disabled={!previewReady}
                variant={previewReady ? "default" : "outline"}
                size="lg"
                className="min-w-[150px]"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Excel Upload & Display */}
            <Card className="shadow-elegant animate-fade-in card-hover" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Excel Spreadsheet</span>
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={onFileChange}
                    />
                    <Button 
                      variant={backendReadyForFile || backendRunning ? "default" : "outline"} 
                      size="sm" 
                      onClick={onUploadClick} 
                      disabled={isUploading || !(backendReadyForFile || backendRunning)}
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        if (!sessionId) {
                          try {
                            const resp = await fetch(`${LIVE_PREVIEW_BASE}/api/session/start`, { method: "POST" });
                            const data = await resp.json();
                            if (data?.sessionId) {
                              setSessionId(data.sessionId);
                              setBackendRunning(true);
                              setBackendReadyForFile(true);
                            }
                          } catch {}
                        }
                        try {
                          const resp = await fetch(`${LIVE_PREVIEW_BASE}/api/session/download?sessionId=${encodeURIComponent(sessionId)}`);
                          if (!resp.ok) {
                            setMessages(prev => [...prev, { type: "system", text: "❌ Download failed.", timestamp: new Date() }]);
                            return;
                          }
                          const blob = await resp.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `excel-current-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.xlsx`;
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          window.URL.revokeObjectURL(url);
                        } catch (e) {
                          setMessages(prev => [...prev, { type: "system", text: "❌ Download failed.", timestamp: new Date() }]);
                        }
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        // Open local file via OS dialog and use it in-place
                        try {
                          if (!sessionId) {
                            const resp = await fetch(`${LIVE_PREVIEW_BASE}/api/session/start`, { method: "POST" });
                            const data = await resp.json();
                            if (data?.sessionId) {
                              setSessionId(data.sessionId);
                              setBackendRunning(true);
                              setBackendReadyForFile(true);
                            } else {
                              return;
                            }
                          }
                          const resp = await fetch(`${LIVE_PREVIEW_BASE}/api/session/open-local?sessionId=${encodeURIComponent(sessionId)}`);
                          const data = await resp.json();
                          if (resp.ok && data?.success) {
                            setMessages(prev => [...prev, { type: "system", text: `📂 Using local file: ${data.path}`, timestamp: new Date() }]);
                            setPreviewReady(true);
                            // Refresh table display
                            const resp2 = await fetch(`${LIVE_PREVIEW_BASE}/api/session/table?sessionId=${encodeURIComponent(sessionId)}`);
                            if (resp2.ok) {
                              const json = await resp2.json();
                              if (json?.headers && json?.rows) {
                                setUploadedTable({ headers: json.headers, rows: json.rows });
                              }
                            }
                          } else {
                            setMessages(prev => [...prev, { type: "system", text: `❌ ${data?.error || "Local open cancelled/failed"}`, timestamp: new Date() }]);
                          }
                        } catch (e) {
                          setMessages(prev => [...prev, { type: "system", text: "❌ Failed to open local file.", timestamp: new Date() }]);
                        }
                      }}
                    >
                      Open Local
                    </Button>

                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg bg-background overflow-auto max-h-[480px] styled-scrollbar">
                  {!uploadedTable ? (
                    <Table className="min-w-max">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead className="text-center">DSA</TableHead>
                          <TableHead className="text-center">Web Dev</TableHead>
                          <TableHead className="text-center">ML</TableHead>
                          <TableHead className="text-center">Attendance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell className={`text-center transition-all duration-500 ${
                              highlightedCell?.row === idx && highlightedCell?.col === "dsa" 
                                ? "bg-primary/20 font-bold scale-110" 
                                : ""
                            }`}>
                              {student.dsa}
                            </TableCell>
                            <TableCell className={`text-center transition-all duration-500 ${
                              highlightedCell?.row === idx && highlightedCell?.col === "web" 
                                ? "bg-primary/20 font-bold scale-110" 
                                : ""
                            }`}>
                              {student.web}
                            </TableCell>
                            <TableCell className={`text-center transition-all duration-500 ${
                              highlightedCell?.row === idx && highlightedCell?.col === "ml" 
                                ? "bg-primary/20 font-bold scale-110" 
                                : ""
                            }`}>
                              {student.ml}
                            </TableCell>
                            <TableCell className={`text-center transition-all duration-500 ${
                              highlightedCell?.row === idx && highlightedCell?.col === "attendance" 
                                ? "bg-primary/20 font-bold scale-110" 
                                : ""
                            }`}>
                              {student.attendance}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Table className="min-w-max">
                      <TableHeader>
                        <TableRow>
                          {uploadedTable.headers.map((h, i) => (
                            <TableHead key={i}>{String(h ?? "")}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uploadedTable.rows.map((row, rIdx) => (
                          <TableRow key={rIdx}>
                            {uploadedTable.headers.map((_, cIdx) => (
                              <TableCell key={cIdx}>
                                {row[cIdx] ?? ""}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
                {/* Removed inline iframe preview; preview opens in a new tab */}
              </CardContent>
            </Card>

            {/* Voice Command Interface */}
            <div className="space-y-6">
              <Card className="shadow-elegant animate-fade-in card-hover" style={{ animationDelay: "0.2s" }}>
                <CardHeader>
                  <CardTitle>Voice Commands</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button
                      size="lg"
                      variant={isListening ? "default" : voiceReady ? "default" : "outline"}
                      disabled={!voiceReady}
                      className={`relative ${isListening ? "animate-pulse" : ""} ${voiceReady ? "" : "opacity-50"}`}
                      onClick={handleMicClick}
                    >
                      <Mic className="w-5 h-5" />
                      {isListening && (
                        <span className="absolute inset-0 rounded-md bg-primary/20 animate-ping" />
                      )}
                    </Button>
                    <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                      <Input
                        placeholder="Type a command or use the microphone..."
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon">
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>

                  <ScrollArea className="h-[300px] border rounded-lg p-4 bg-muted/30">
                    <div className="space-y-3">
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg animate-fade-in ${
                            msg.type === "user"
                              ? "bg-primary/10 ml-8"
                              : "bg-muted mr-8"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                      
                      {/* Confirmation UI removed in demo reset */}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="shadow-elegant animate-fade-in bg-gradient-to-br from-primary/5 to-accent/5 card-hover" style={{ animationDelay: "0.3s" }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold mb-2">Try these commands:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• "Add 85 for Priya in DSA"</li>
                        <li>• "Mark Rahul present"</li>
                        <li>• "Add 95 for Ananya in Web"</li>
                      </ul>
                    </div>
                    <Button variant="outline" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
