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

const zones = [];
const recentAlerts = [];
const quickStats = [
  { title: 'System Uptime', value: '99.94%', change: '+0.02%', icon: Zap, color: 'success' },
  { title: 'Active Sensors', value: '0/0', change: '0', icon: Activity, color: 'warning' },
  { title: 'Predictions Run', value: '0', change: '0', icon: TrendingUp, color: 'info' },
  { title: 'Risk Score', value: '0/100', change: '0', icon: AlertTriangle, color: 'danger' },
];

export default function Dashboard() {
  const systemStatus = 'safe'; // safe, caution, danger, critical

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
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Risk Data Available</h3>
                <p className="text-muted-foreground">
                  Connect sensors and configure zones to start tracking risk trends.
                </p>
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
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Zones Configured</h3>
                  <p className="text-muted-foreground">
                    Configure mining zones to start monitoring risk levels.
                  </p>
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
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Clear</h3>
                  <p className="text-muted-foreground">
                    No active alerts. System is operating normally.
                  </p>
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