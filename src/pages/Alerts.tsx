import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Clock, 
  Filter, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle,
  Bell,
  MapPin,
  Activity,
  Settings,
  Download,
  RefreshCw
} from "lucide-react";

interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  zone: string;
  timestamp: string;
  sensor: string;
  status: 'active' | 'acknowledged' | 'resolved';
  actions: string[];
}

const alertsData: Alert[] = [
  {
    id: 'ALT-001',
    severity: 'critical',
    title: 'Immediate Rockfall Risk - East Wall',
    description: 'Multiple sensors detecting severe ground instability. Visible crack expansion of 15cm in last hour.',
    zone: 'Zone Z-003 (East Wall)',
    timestamp: '2 minutes ago',
    sensor: 'Tilt Sensor T-15, Crack Monitor C-08',
    status: 'active',
    actions: ['Evacuate Zone Z-003', 'Deploy Emergency Response Team', 'Notify Safety Supervisor']
  },
  {
    id: 'ALT-002',
    severity: 'high',
    title: 'Sensor Network Disruption',
    description: 'Communication lost with 5 ground vibration sensors in North Pit area.',
    zone: 'Zone Z-001 (North Pit)',
    timestamp: '15 minutes ago',
    sensor: 'Vibration Sensors V-12 to V-16',
    status: 'acknowledged',
    actions: ['Dispatch Maintenance Team', 'Switch to Backup Sensors', 'Field Inspection']
  },
  {
    id: 'ALT-003',
    severity: 'medium',
    title: 'Weather Impact Warning',
    description: 'Heavy rainfall increasing slope instability risk across all zones.',
    zone: 'All Zones',
    timestamp: '1 hour ago',
    sensor: 'Weather Station WS-01',
    status: 'acknowledged',
    actions: ['Increase Monitoring Frequency', 'Review Weather Forecast', 'Prepare Mitigation']
  },
  {
    id: 'ALT-004',
    severity: 'high',
    title: 'Crack Propagation Detected',
    description: 'New crack formation detected in South Pit with 8cm extension in 6 hours.',
    zone: 'Zone Z-002 (South Pit)',
    timestamp: '45 minutes ago',
    sensor: 'Crack Monitor C-12',
    status: 'active',
    actions: ['Visual Inspection Required', 'Install Additional Monitors', 'Safety Barrier Setup']
  },
  {
    id: 'ALT-005',
    severity: 'low',
    title: 'Routine Sensor Calibration Due',
    description: 'Scheduled calibration required for tilt sensors in West Quarry.',
    zone: 'Zone Z-004 (West Quarry)',
    timestamp: '3 hours ago',
    sensor: 'Tilt Sensors T-20 to T-25',
    status: 'resolved',
    actions: ['Schedule Maintenance', 'Calibration Procedure', 'Update Sensor Registry']
  }
];

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  const filteredAlerts = alertsData.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Bell className="w-4 h-4 text-blue-500" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-destructive';
      case 'acknowledged': return 'text-warning';
      case 'resolved': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const handleAcknowledge = (alertId: string) => {
    console.log('Acknowledging alert:', alertId);
    // In a real app, this would make an API call
  };

  const handleResolve = (alertId: string) => {
    console.log('Resolving alert:', alertId);
  };

  const alertStats = {
    total: alertsData.length,
    critical: alertsData.filter(a => a.severity === 'critical').length,
    active: alertsData.filter(a => a.status === 'active').length,
    acknowledged: alertsData.filter(a => a.status === 'acknowledged').length,
  };

  return (
    <DashboardLayout 
      title="Alert Management" 
      subtitle="Real-time alert monitoring and incident response system"
    >
      {/* Alert Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{alertStats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-destructive">{alertStats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-warning">{alertStats.active}</p>
              </div>
              <Activity className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Acknowledged</p>
                <p className="text-2xl font-bold text-success">{alertStats.acknowledged}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter & Search Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts by title, description, or zone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card className="glass-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Active Alerts ({filteredAlerts.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="btn-industrial">
                <CheckCircle className="w-4 h-4 mr-2" />
                Bulk Acknowledge
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-4 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{alert.title}</h3>
                        <Badge variant={getSeverityColor(alert.severity) as any}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">ID: {alert.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">{alert.timestamp}</div>
                  </div>
                </div>

                <p className="text-sm mb-3">{alert.description}</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Zone:</span>
                    <span>{alert.zone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Sensor:</span>
                    <span>{alert.sensor}</span>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                  <div className="flex flex-wrap gap-1">
                    {alert.actions.map((action, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  {alert.status === 'active' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAcknowledge(alert.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Acknowledge
                    </Button>
                  )}
                  {alert.status === 'acknowledged' && (
                    <Button 
                      size="sm" 
                      className="btn-success"
                      onClick={() => handleResolve(alert.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                  )}
                  {alert.severity === 'critical' && (
                    <Button size="sm" className="btn-danger">
                      <Settings className="w-4 h-4 mr-1" />
                      Emergency
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Alerts Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || severityFilter !== 'all' || statusFilter !== 'all' 
                  ? 'No alerts match your current filters.' 
                  : 'All systems are operating normally.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}