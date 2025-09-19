import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Clock,
  User,
  Zap
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'assistant',
    content: 'Hello! I\'m your Mine Sentinel AI Assistant. I can help you with safety analysis, risk assessment, and system monitoring. What would you like to know?',
    timestamp: new Date().toLocaleTimeString(),
    suggestions: [
      'Which zone has the highest risk right now?',
      'Show me the latest predictions',
      'What caused the recent alert in East Wall?',
      'Generate a safety report for today'
    ]
  }
];

const quickQueries = [
  { icon: AlertTriangle, text: 'Current risk status', color: 'destructive' },
  { icon: TrendingUp, text: 'Latest predictions', color: 'primary' },
  { icon: MapPin, text: 'Zone analysis', color: 'success' },
  { icon: Zap, text: 'System health', color: 'warning' }
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toLocaleTimeString(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): { content: string; suggestions?: string[] } => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('risk') && lowerQuery.includes('zone')) {
      return {
        content: 'Based on current data analysis, Zone Z-003 (East Wall) has the highest risk level at 89% with critical ground instability detected. I recommend immediate evacuation and emergency response deployment. The AI confidence level is 94%.',
        suggestions: [
          'Show evacuation procedures for East Wall',
          'What sensors are active in Zone Z-003?',
          'Generate emergency report',
          'Alert emergency response team'
        ]
      };
    }

    if (lowerQuery.includes('prediction') || lowerQuery.includes('forecast')) {
      return {
        content: 'Latest AI predictions show: North Pit (15% risk - stable), South Pit (64% risk - increasing trend), East Wall (89% risk - critical), West Quarry (28% risk - stable). The models are running with 87% average confidence. Next prediction cycle in 2 hours.',
        suggestions: [
          'Detailed analysis for South Pit',
          'Historical trend comparison',
          'Update prediction parameters',
          'Schedule additional monitoring'
        ]
      };
    }

    if (lowerQuery.includes('alert') || lowerQuery.includes('east wall')) {
      return {
        content: 'The East Wall alert was triggered by multiple factors: 15cm crack expansion in 1 hour, severe ground displacement detected by tilt sensors T-15, and increased seismic activity. The AI system classified this as critical with 94% confidence due to convergent sensor readings.',
        suggestions: [
          'View sensor T-15 historical data',
          'Check weather impact factors',
          'Review similar past incidents',
          'Update risk mitigation plan'
        ]
      };
    }

    if (lowerQuery.includes('report') || lowerQuery.includes('safety')) {
      return {
        content: 'I can generate a comprehensive safety report for today including: 5 total alerts (1 critical, 1 high, 2 medium, 1 low), 382 predictions processed, 91.2% AI accuracy, and system uptime of 99.94%. Would you like me to export this as PDF?',
        suggestions: [
          'Export PDF report',
          'Email report to supervisors',
          'Schedule automated reports',
          'Compare with yesterday\'s data'
        ]
      };
    }

    if (lowerQuery.includes('system') || lowerQuery.includes('health')) {
      return {
        content: 'System health status: 847/856 sensors active (98.9%), AI models running optimally, 15.2TB storage available, network latency 45ms. Minor issues: 3 sensors offline in North Pit requiring maintenance. Overall system performance: Excellent.',
        suggestions: [
          'Schedule sensor maintenance',
          'View detailed system metrics',
          'Check network diagnostics',
          'Update system components'
        ]
      };
    }

    // Default response
    return {
      content: 'I understand you\'re asking about mine safety operations. Could you be more specific? I can help with risk analysis, predictions, alerts, system status, zone monitoring, sensor data, or safety recommendations.',
      suggestions: [
        'Show current risk levels',
        'Explain AI prediction process',
        'List active alerts',
        'Check sensor status'
      ]
    };
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // In a real app, this would start/stop speech recognition
  };

  const handleSpeakToggle = () => {
    setIsSpeaking(!isSpeaking);
    // In a real app, this would enable/disable text-to-speech
  };

  const handleQuickQuery = (query: string) => {
    handleSendMessage(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <DashboardLayout 
      title="AI Assistant" 
      subtitle="Natural language interaction with Mine Sentinel's AI system"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Quick Actions Sidebar */}
        <Card className="glass-panel lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Quick Queries
            </CardTitle>
            <CardDescription>
              Common questions and system interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickQueries.map((query, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => handleQuickQuery(query.text)}
              >
                <query.icon className={`w-4 h-4 mr-2 text-${query.color}`} />
                <span className="text-sm">{query.text}</span>
              </Button>
            ))}

            <div className="border-t border-border pt-4">
              <h4 className="font-medium mb-3">Voice Controls</h4>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={isListening ? "default" : "outline"}
                  onClick={handleVoiceToggle}
                  className="flex-1"
                >
                  {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant={isSpeaking ? "default" : "outline"}
                  onClick={handleSpeakToggle}
                  className="flex-1"
                >
                  {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-medium mb-3">AI Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Model Version:</span>
                  <Badge variant="outline">v2.1.3</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-medium text-success">87%</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="font-medium">1.2s</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="glass-panel lg:col-span-3 flex flex-col">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              Mine Sentinel AI Assistant
              {isProcessing && (
                <Badge variant="outline" className="animate-pulse">
                  Processing...
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Ask questions about safety, predictions, alerts, and system status
            </CardDescription>
          </CardHeader>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.type === 'assistant' ? (
                        <Bot className="w-4 h-4 text-primary" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span className="text-xs opacity-75">
                        {message.type === 'assistant' ? 'AI Assistant' : 'You'}
                      </span>
                      <span className="text-xs opacity-50">{message.timestamp}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {message.suggestions && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs opacity-75">Suggested follow-ups:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              className="text-xs h-6"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-primary animate-pulse" />
                      <span className="text-sm">AI is analyzing your request...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about safety, risks, predictions, or system status..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleVoiceToggle}
                    className={`w-8 h-8 p-0 ${isListening ? 'text-destructive' : ''}`}
                  >
                    {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isProcessing}
                className="btn-industrial"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>AI typically responds in 1-2 seconds</span>
              {isListening && (
                <>
                  <span>•</span>
                  <span className="text-destructive flex items-center gap-1">
                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                    Listening...
                  </span>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}