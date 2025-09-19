import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Play
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Real-time data that updates
const riskTrendData = [
  { time: '00:00', risk: 15, confidence: 85 },
  { time: '04:00', risk: 22, confidence: 78 },
  { time: '08:00', risk: 45, confidence: 92 },
  { time: '12:00', risk: 38, confidence: 88 },
  { time: '16:00', risk: 62, confidence: 76 },
  { time: '20:00', risk: 28, confidence: 94 },
  { time: '24:00', risk: 31, confidence: 82 },
];

const zones = [
  { id: 'Z-001', name: 'North Pit', status: 'safe', risk: 12, lastUpdate: '2 mins ago' },
  { id: 'Z-002', name: 'South Pit', status: 'caution', risk: 45, lastUpdate: '1 min ago' },
  { id: 'Z-003', name: 'East Wall', status: 'danger', risk: 78, lastUpdate: '30 sec ago' },
  { id: 'Z-004', name: 'West Quarry', status: 'safe', risk: 8, lastUpdate: '3 mins ago' },
];

const recentAlerts = [
  { id: 1, type: 'critical', message: 'Ground instability detected in Zone Z-003', time: '2 mins ago', zone: 'East Wall' },
  { id: 2, type: 'high', message: 'Sensor network disruption in North Pit', time: '15 mins ago', zone: 'North Pit' },
  { id: 3, type: 'medium', message: 'Weather conditions affecting stability', time: '1 hour ago', zone: 'All Zones' },
];

const quickStats = [
  { title: 'System Uptime', value: '99.94%', change: '+0.02%', icon: Zap, color: 'success' },
  { title: 'Active Sensors', value: '847/856', change: '-9', icon: Activity, color: 'warning' },
  { title: 'Predictions Run', value: '12,483', change: '+125', icon: TrendingUp, color: 'info' },
  { title: 'Risk Score', value: '42/100', change: '+5', icon: AlertTriangle, color: 'danger' },
];

export default function Dashboard() {
  const systemStatus = 'caution'; // safe, caution, danger, critical

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'safe': return 'text-status-safe border-status-safe bg-status-safe/10';
      case 'caution': return 'text-status-caution border-status-caution bg-status-caution/10';
      case 'danger': return 'text-status-danger border-status-danger bg-status-danger/10';
      case 'critical': return 'text-status-critical border-status-critical bg-status-critical/10';
      default: return 'text-muted-foreground border-border bg-muted/10';
    }
  };

  const getAlertColor = (type: string) => {
    switch(type) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <DashboardLayout 
      title="Mine Sentinel Dashboard" 
      subtitle="Real-time AI-powered rockfall prediction and monitoring system"
    >
      {/* System Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 glass-panel">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg border-2 ${getStatusColor(systemStatus)}`}>
              <div className="text-center">
                <div className="text-2xl font-bold uppercase">{systemStatus}</div>
                <div className="text-sm opacity-75 mt-1">Overall Risk Level</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>AI Confidence</span>
                <span>87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {quickStats.map((stat, index) => (
          <Card key={index} className="glass-panel">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs text-${stat.color}`}>{stat.change}</p>
                </div>
                <stat.icon className={`w-8 h-8 text-${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Trend Chart */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Risk Trend Analysis (24h)
          </CardTitle>
          <CardDescription>
            AI-powered risk assessment with confidence intervals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
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
                  fill="url(#riskGradient)"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Zone Status and Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Status */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Zone Status
            </CardTitle>
            <CardDescription>Real-time monitoring of all mining zones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {zones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(zone.status)}>
                      {zone.status.toUpperCase()}
                    </Badge>
                    <div>
                      <div className="font-medium">{zone.name}</div>
                      <div className="text-sm text-muted-foreground">{zone.id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{zone.risk}%</div>
                    <div className="text-xs text-muted-foreground">{zone.lastUpdate}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Latest system notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="p-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={getAlertColor(alert.type) as any}>
                      {alert.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-sm mb-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">Zone: {alert.zone}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
              <Button size="sm" variant="outline">
                <CheckCircle className="w-4 h-4 mr-2" />
                Acknowledge
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used system operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2 btn-industrial">
              <Play className="w-6 h-6" />
              Run Prediction
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <AlertTriangle className="w-6 h-6" />
              View Alerts
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Activity className="w-6 h-6" />
              Upload Data
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Download className="w-6 h-6" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}