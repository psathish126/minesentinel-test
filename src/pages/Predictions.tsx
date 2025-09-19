import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, MapPin, Clock, Target, AlertCircle, CheckCircle, Calendar, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts';

const zoneForecasts = [];
const historicalData = [];
const predictionMetrics = [];

export default function Predictions() {
  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'text-status-critical border-status-critical bg-status-critical/10';
    if (risk >= 60) return 'text-status-danger border-status-danger bg-status-danger/10';
    if (risk >= 30) return 'text-status-caution border-status-caution bg-status-caution/10';
    return 'text-status-safe border-status-safe bg-status-safe/10';
  };

  const getTrendColor = (trend: string) => {
    switch(trend) {
      case 'critical': return 'text-status-critical';
      case 'increasing': return 'text-status-danger';
      case 'stable': return 'text-status-safe';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <DashboardLayout 
      title="Predictions" 
      subtitle="AI-powered zone-wise risk forecasts and predictive analytics"
    >
      {/* Control Panel */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              <SelectItem value="Z-001">North Pit</SelectItem>
              <SelectItem value="Z-002">South Pit</SelectItem>
              <SelectItem value="Z-003">East Wall</SelectItem>
              <SelectItem value="Z-004">West Quarry</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="24h">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button className="btn-industrial">
            <Target className="w-4 h-4 mr-2" />
            Run New Prediction
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Analysis
          </Button>
        </div>
      </div>

      <Tabs defaultValue="forecasts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forecasts">Zone Forecasts</TabsTrigger>
          <TabsTrigger value="historical">Historical Patterns</TabsTrigger>
          <TabsTrigger value="performance">AI Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasts" className="space-y-6">
          {/* Zone Risk Forecasts */}
          {zoneForecasts.length === 0 ? (
            <Card className="glass-panel">
              <CardContent className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Prediction Data Available</h3>
                <p className="text-muted-foreground mb-4">
                  Configure zones and connect sensors to start generating AI predictions.
                </p>
                <Button className="btn-industrial">
                  <Target className="w-4 h-4 mr-2" />
                  Configure Zones
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Zone forecast cards would go here */}
            </div>
          )}
        </TabsContent>

        <TabsContent value="historical" className="space-y-6">
          {/* Historical Risk Patterns */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Historical Risk Patterns (7 Days)
              </CardTitle>
              <CardDescription>
                Analysis of past risk levels and prediction accuracy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient id="riskHistoryGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="risk" 
                      stroke="hsl(var(--warning))" 
                      fill="url(#riskHistoryGradient)"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Prediction Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Predictions</span>
                    <span className="font-bold">382</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Successful Predictions</span>
                    <span className="font-bold text-success">349</span>
                  </div>
                  <div className="flex justify-between">
                    <span>False Positives</span>
                    <span className="font-bold text-warning">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Missed Events</span>
                    <span className="font-bold text-destructive">5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Safe (0-30%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-status-safe"></div>
                      </div>
                      <span className="text-sm">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Caution (30-60%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-1/5 h-full bg-status-caution"></div>
                      </div>
                      <span className="text-sm">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Danger (60-80%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-1/20 h-full bg-status-danger"></div>
                      </div>
                      <span className="text-sm">4%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Critical (80%+)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-1/100 h-full bg-status-critical"></div>
                      </div>
                      <span className="text-sm">1%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Model Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Model v2.1.3 Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Last trained: 2 days ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-info" />
                    <span className="text-sm">Next training: In 5 days</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    View Model Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* AI Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {predictionMetrics.map((metric, index) => (
              <Card key={index} className="glass-panel">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold">{metric.value}%</div>
                  <div className="text-sm text-muted-foreground">{metric.metric}</div>
                  <div className="text-xs text-success mt-1">{metric.change}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Model Comparison */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Model Performance Comparison</CardTitle>
              <CardDescription>
                Accuracy comparison between different AI model versions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                      }} 
                    />
                    <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="predictions" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}