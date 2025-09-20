import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Settings,
  RefreshCw,
  Battery,
  Thermometer,
  Gauge,
  Search,
  Filter,
  Download,
  Bell,
  Wrench,
  MapPin,
  Clock,
  Zap
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Sensor {
  id: string;
  name: string;
  type: 'vibration' | 'tilt' | 'crack' | 'weather' | 'seismic';
  zone: string;
  status: 'active' | 'warning' | 'offline' | 'maintenance';
  value: string;
  unit: string;
  battery: number;
  temperature: number;
  lastUpdate: string;
  coordinates: string;
  threshold: {
    min: number;
    max: number;
  };
  calibrationDue: string;
}

const mockSensors: Sensor[] = [];

const sensorData = [
  { time: '00:00', vibration: 2.1, tilt: 0.5, crack: 0.02 },
  { time: '04:00', vibration: 2.3, tilt: 0.7, crack: 0.03 },
  { time: '08:00', vibration: 1.8, tilt: 0.4, crack: 0.02 },
  { time: '12:00', vibration: 2.5, tilt: 0.8, crack: 0.04 },
  { time: '16:00', vibration: 2.2, tilt: 0.6, crack: 0.03 },
  { time: '20:00', vibration: 1.9, tilt: 0.5, crack: 0.02 },
];

export default function SensorMonitoring() {
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  const filteredSensors = sensors.filter(sensor => {
    const matchesSearch = sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sensor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sensor.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sensor.status === statusFilter;
    const matchesType = typeFilter === 'all' || sensor.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'success';
      case 'warning': return 'default';
      case 'offline': return 'destructive';
      case 'maintenance': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'offline': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'maintenance': return <Wrench className="w-4 h-4 text-muted-foreground" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'vibration': return <Activity className="w-4 h-4" />;
      case 'tilt': return <Gauge className="w-4 h-4" />;
      case 'crack': return <AlertTriangle className="w-4 h-4" />;
      case 'weather': return <Thermometer className="w-4 h-4" />;
      case 'seismic': return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const sensorStats = {
    total: sensors.length,
    active: sensors.filter(s => s.status === 'active').length,
    warning: sensors.filter(s => s.status === 'warning').length,
    offline: sensors.filter(s => s.status === 'offline').length,
    batteryLow: sensors.filter(s => s.battery < 20).length,
  };

  const handleCalibrate = (sensorId: string) => {
    console.log('Calibrating sensor:', sensorId);
    // In a real app, this would trigger calibration
  };

  const handleReconnect = (sensorId: string) => {
    console.log('Reconnecting sensor:', sensorId);
    // In a real app, this would attempt to reconnect
  };

  return (
    <DashboardLayout 
      title="Sensor Monitoring" 
      subtitle="Real-time IoT device management and sensor health monitoring"
    >
      {/* Sensor Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sensors</p>
                <p className="text-2xl font-bold">{sensorStats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-success">{sensorStats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warning</p>
                <p className="text-2xl font-bold text-warning">{sensorStats.warning}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-destructive">{sensorStats.offline}</p>
              </div>
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Battery</p>
                <p className="text-2xl font-bold text-warning">{sensorStats.batteryLow}</p>
              </div>
              <Battery className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter & Search Sensors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search sensors by name, ID, or zone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="vibration">Vibration</SelectItem>
                <SelectItem value="tilt">Tilt</SelectItem>
                <SelectItem value="crack">Crack Monitor</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="seismic">Seismic</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sensors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sensors">Sensor Network</TabsTrigger>
          <TabsTrigger value="readings">Live Readings</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="sensors" className="space-y-4">
          {filteredSensors.length === 0 ? (
            <Card className="glass-panel">
              <CardContent className="text-center py-12">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Sensors Found</h3>
                <p className="text-muted-foreground">
                  {sensors.length === 0 
                    ? "Connect sensors to start monitoring your mining operations."
                    : "No sensors match your current search and filter criteria."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredSensors.map((sensor) => (
              <Card key={sensor.id} className="glass-panel hover:bg-muted/10 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(sensor.type)}
                      <div>
                        <CardTitle className="text-base">{sensor.name}</CardTitle>
                        <CardDescription>{sensor.id}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(sensor.status) as any}>
                      {sensor.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Reading */}
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Current Reading</span>
                      {getStatusIcon(sensor.status)}
                    </div>
                    <div className="text-2xl font-bold">
                      {sensor.value} {sensor.unit}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Range: {sensor.threshold.min} - {sensor.threshold.max} {sensor.unit}
                    </div>
                  </div>

                  {/* Sensor Health */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Battery Level</span>
                        <span>{sensor.battery}%</span>
                      </div>
                      <Progress 
                        value={sensor.battery} 
                        className={`h-2 ${sensor.battery < 20 ? '[&>div]:bg-destructive' : ''}`} 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Temperature</span>
                        <div className="font-medium">{sensor.temperature}°C</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Update</span>
                        <div className="font-medium">{sensor.lastUpdate}</div>
                      </div>
                    </div>
                  </div>

                  {/* Location & Zone */}
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>Location</span>
                    </div>
                    <div className="text-sm font-medium">{sensor.zone}</div>
                    <div className="text-xs text-muted-foreground">{sensor.coordinates}</div>
                  </div>

                  {/* Maintenance Info */}
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Calibration due:</span>
                    <span className={sensor.calibrationDue === 'Overdue' ? 'text-destructive font-medium' : 'font-medium'}>
                      {sensor.calibrationDue}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                    {sensor.status === 'offline' ? (
                      <Button 
                        size="sm" 
                        className="btn-warning flex-1"
                        onClick={() => handleReconnect(sensor.id)}
                      >
                        <Wifi className="w-3 h-3 mr-1" />
                        Reconnect
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleCalibrate(sensor.id)}
                      >
                        <Wrench className="w-3 h-3 mr-1" />
                        Calibrate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="readings" className="space-y-4">
          {/* Live Sensor Readings Chart */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live Sensor Readings (24h)
              </CardTitle>
              <CardDescription>
                Real-time data from critical sensors across all zones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sensorData}>
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
                    <Line 
                      type="monotone" 
                      dataKey="vibration" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      name="Vibration (m/s²)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tilt" 
                      stroke="hsl(var(--warning))" 
                      strokeWidth={2}
                      name="Tilt (°)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="crack" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      name="Crack Width (cm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          {/* Maintenance Schedule */}
          <Card className="glass-panel">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Maintenance Schedule
                </CardTitle>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Schedule
                </Button>
              </div>
              <CardDescription>
                Sensor calibration and maintenance requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSensors
                  .filter(sensor => sensor.calibrationDue !== 'In 14 days')
                  .sort((a, b) => a.calibrationDue === 'Overdue' ? -1 : 1)
                  .map((sensor) => (
                  <div key={sensor.id} className="p-4 border border-border/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(sensor.type)}
                        <div>
                          <h4 className="font-medium">{sensor.name}</h4>
                          <p className="text-sm text-muted-foreground">{sensor.id} - {sensor.zone}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={sensor.calibrationDue === 'Overdue' ? 'destructive' : 'default'}
                      >
                        {sensor.calibrationDue}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Battery:</span>
                        <span className={`ml-1 font-medium ${sensor.battery < 20 ? 'text-destructive' : ''}`}>
                          {sensor.battery}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <span className="ml-1 font-medium">{sensor.status}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Temperature:</span>
                        <span className="ml-1 font-medium">{sensor.temperature}°C</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Update:</span>
                        <span className="ml-1 font-medium">{sensor.lastUpdate}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Bell className="w-3 h-3 mr-1" />
                        Schedule
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                      <Button 
                        size="sm" 
                        className="btn-industrial"
                        onClick={() => handleCalibrate(sensor.id)}
                      >
                        <Wrench className="w-3 h-3 mr-1" />
                        Calibrate Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}