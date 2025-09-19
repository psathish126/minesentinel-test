import { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Map, 
  Layers, 
  Navigation, 
  Camera, 
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MapPin,
  AlertTriangle,
  Activity,
  Settings,
  Download,
  Eye,
  Filter
} from "lucide-react";

// Mock 3D map data
const zones = [
  { id: 'Z-001', name: 'North Pit', coordinates: [0.2, 0.3], risk: 15, status: 'safe' },
  { id: 'Z-002', name: 'South Pit', coordinates: [0.6, 0.7], risk: 64, status: 'caution' },
  { id: 'Z-003', name: 'East Wall', coordinates: [0.8, 0.4], risk: 89, status: 'critical' },
  { id: 'Z-004', name: 'West Quarry', coordinates: [0.1, 0.6], risk: 28, status: 'safe' }
];

const riskHeatmapData = [
  { x: 0.1, y: 0.2, intensity: 0.1 },
  { x: 0.3, y: 0.4, intensity: 0.3 },
  { x: 0.5, y: 0.6, intensity: 0.6 },
  { x: 0.7, y: 0.8, intensity: 0.9 },
  { x: 0.9, y: 0.3, intensity: 0.8 }
];

const sensorLocations = [
  { id: 'T-15', type: 'Tilt', position: [0.8, 0.4], status: 'active', value: '2.5°' },
  { id: 'V-12', type: 'Vibration', position: [0.2, 0.3], status: 'active', value: '0.3 m/s²' },
  { id: 'C-08', type: 'Crack', position: [0.8, 0.35], status: 'alert', value: '15cm' },
  { id: 'WS-01', type: 'Weather', position: [0.5, 0.1], status: 'active', value: '12mm/h' }
];

export default function GeospatialView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLayer, setSelectedLayer] = useState('risk');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('2d');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'safe': return '#10b981';
      case 'caution': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return '#ef4444';
    if (risk >= 60) return '#f97316';
    if (risk >= 30) return '#f59e0b';
    return '#10b981';
  };

  const getSensorStatusColor = (status: string) => {
    switch(status) {
      case 'active': return '#10b981';
      case 'alert': return '#ef4444';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const resetView = () => {
    setSelectedZone(null);
    // Reset map view to default position
  };

  // Simulate map rendering
  useEffect(() => {
    if (mapRef.current) {
      // In a real app, this would initialize the actual 3D map library (Three.js, Mapbox GL, etc.)
      console.log('Initializing 3D map view...');
    }
  }, []);

  const layerStats = {
    risk: { visible: 4, total: 4, updated: '2 mins ago' },
    sensors: { visible: 847, total: 856, updated: '30 sec ago' },
    displacement: { visible: 12, total: 15, updated: '1 min ago' },
    weather: { visible: 1, total: 1, updated: '5 mins ago' }
  };

  return (
    <DashboardLayout 
      title="Geospatial Visualization" 
      subtitle="Interactive 3D mine mapping with real-time risk overlays"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Control Panel */}
        <Card className="glass-panel lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Map Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* View Mode */}
            <div>
              <h4 className="font-medium mb-3">View Mode</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant={viewMode === '2d' ? 'default' : 'outline'}
                  onClick={() => setViewMode('2d')}
                  className="w-full"
                >
                  <Map className="w-4 h-4 mr-1" />
                  2D
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === '3d' ? 'default' : 'outline'}
                  onClick={() => setViewMode('3d')}
                  className="w-full"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  3D
                </Button>
              </div>
            </div>

            {/* Layer Controls */}
            <div>
              <h4 className="font-medium mb-3">Overlay Layers</h4>
              <div className="space-y-2">
                <Select value={selectedLayer} onValueChange={setSelectedLayer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select layer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="risk">Risk Heatmap</SelectItem>
                    <SelectItem value="sensors">Sensor Network</SelectItem>
                    <SelectItem value="displacement">Ground Displacement</SelectItem>
                    <SelectItem value="weather">Weather Impact</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Visible:</span>
                    <span>{layerStats[selectedLayer as keyof typeof layerStats]?.visible || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>{layerStats[selectedLayer as keyof typeof layerStats]?.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span className="text-muted-foreground">
                      {layerStats[selectedLayer as keyof typeof layerStats]?.updated || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div>
              <h4 className="font-medium mb-3">Navigation</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={resetView}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Playback Controls */}
            <div>
              <h4 className="font-medium mb-3">Drone Flythrough</h4>
              <div className="flex gap-2 mb-3">
                <Button
                  size="sm"
                  variant={isPlaying ? 'default' : 'outline'}
                  onClick={togglePlayback}
                  className="flex-1"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                {isPlaying ? 'Playing drone survey footage...' : 'Paused - Click play to start'}
              </div>
            </div>

            {/* Zone Selection */}
            <div>
              <h4 className="font-medium mb-3">Zone Focus</h4>
              <div className="space-y-1">
                {zones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => handleZoneClick(zone.id)}
                    className={`w-full p-2 rounded-lg border text-left transition-colors ${
                      selectedZone === zone.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{zone.name}</span>
                      <Badge 
                        style={{ 
                          backgroundColor: `${getRiskColor(zone.risk)}20`,
                          color: getRiskColor(zone.risk),
                          borderColor: `${getRiskColor(zone.risk)}40`
                        }}
                      >
                        {zone.risk}%
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{zone.id}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export View
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Map Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Map View */}
        <div className="lg:col-span-3 space-y-4">
          {/* Map Container */}
          <Card className="glass-panel flex-1">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Interactive Mine Map
                  <Badge variant="outline">{viewMode.toUpperCase()}</Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={selectedLayer === 'risk' ? 'border-warning text-warning' : ''}
                  >
                    {selectedLayer.charAt(0).toUpperCase() + selectedLayer.slice(1)} Layer
                  </Badge>
                  {isPlaying && (
                    <Badge className="bg-destructive/20 text-destructive">
                      Live Drone Feed
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative">
              {/* Map Container - In a real app, this would contain the actual 3D map */}
              <div
                ref={mapRef}
                className="w-full h-[500px] bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden"
              >
                {/* Mock map background */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
                
                {/* Zone Markers */}
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                      selectedZone === zone.id ? 'scale-125' : 'hover:scale-110'
                    } transition-transform`}
                    style={{
                      left: `${zone.coordinates[0] * 100}%`,
                      top: `${zone.coordinates[1] * 100}%`
                    }}
                    onClick={() => handleZoneClick(zone.id)}
                  >
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: getRiskColor(zone.risk) }}
                    >
                      <div className="w-full h-full rounded-full animate-ping opacity-75"
                           style={{ backgroundColor: getRiskColor(zone.risk) }}
                      ></div>
                    </div>
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {zone.name}
                        <div className="text-center">{zone.risk}%</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Sensor Network Overlay */}
                {selectedLayer === 'sensors' && sensorLocations.map((sensor) => (
                  <div
                    key={sensor.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${sensor.position[0] * 100}%`,
                      top: `${sensor.position[1] * 100}%`
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ 
                        backgroundColor: getSensorStatusColor(sensor.status),
                        borderColor: 'white'
                      }}
                    ></div>
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                        {sensor.id}: {sensor.value}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Risk Heatmap Overlay */}
                {selectedLayer === 'risk' && riskHeatmapData.map((point, index) => (
                  <div
                    key={index}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{
                      left: `${point.x * 100}%`,
                      top: `${point.y * 100}%`
                    }}
                  >
                    <div 
                      className="w-16 h-16 rounded-full blur-md"
                      style={{ 
                        backgroundColor: `rgba(239, 68, 68, ${point.intensity * 0.6})`,
                      }}
                    ></div>
                  </div>
                ))}

                {/* Map Controls Overlay */}
                <div className="absolute top-4 right-4 space-y-2">
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                    <Navigation className="w-4 h-4" />
                  </Button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg">
                  <h4 className="font-medium mb-2 text-sm">Risk Level</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Safe (0-30%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Caution (30-60%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span>Danger (60-80%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Critical (80%+)</span>
                    </div>
                  </div>
                </div>

                {/* Drone Playback Indicator */}
                {isPlaying && (
                  <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-2 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">LIVE DRONE SURVEY</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Zone Details Panel */}
          {selectedZone && (
            <Card className="glass-panel">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Zone Details: {zones.find(z => z.id === selectedZone)?.name}
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedZone(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">
                      {zones.find(z => z.id === selectedZone)?.risk}%
                    </div>
                    <div className="text-sm text-muted-foreground">Risk Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">4</div>
                    <div className="text-sm text-muted-foreground">Active Sensors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">2</div>
                    <div className="text-sm text-muted-foreground">Recent Alerts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-info">1.2km</div>
                    <div className="text-sm text-muted-foreground">Distance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}