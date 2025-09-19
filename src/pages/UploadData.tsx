import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  FileText, 
  Image, 
  Database, 
  Cloud, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Trash2,
  Eye,
  Wifi,
  HardDrive,
  Camera
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  uploadedAt: string;
  source: 'manual' | 'iot' | 'cloud';
}

const mockUploadedFiles: UploadedFile[] = [
  {
    id: '1',
    name: 'sensor_data_2024_01_19.csv',
    size: 2048576,
    type: 'CSV',
    status: 'completed',
    progress: 100,
    uploadedAt: '2 hours ago',
    source: 'manual'
  },
  {
    id: '2',
    name: 'drone_survey_east_wall.zip',
    size: 15728640,
    type: 'LiDAR',
    status: 'processing',
    progress: 75,
    uploadedAt: '1 hour ago',
    source: 'manual'
  },
  {
    id: '3',
    name: 'realtime_vibration_feed',
    size: 0,
    type: 'IoT Stream',
    status: 'completed',
    progress: 100,
    uploadedAt: 'Live',
    source: 'iot'
  }
];

export default function UploadData() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(mockUploadedFiles);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    
    // Simulate file upload
    acceptedFiles.forEach(file => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type.includes('csv') ? 'CSV' : file.type.includes('image') ? 'Image' : 'Data',
        status: 'uploading',
        progress: 0,
        uploadedAt: 'Just now',
        source: 'manual'
      };

      setUploadedFiles(prev => [newFile, ...prev]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === newFile.id) {
            const newProgress = Math.min(f.progress + Math.random() * 20, 100);
            return {
              ...f,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'uploading'
            };
          }
          return f;
        }));
      }, 500);

      setTimeout(() => clearInterval(interval), 5000);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/zip': ['.zip'],
      'image/*': ['.jpg', '.jpeg', '.png', '.tiff'],
      'application/json': ['.json']
    }
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'processing': return <AlertCircle className="w-4 h-4 text-warning animate-spin" />;
      case 'uploading': return <Upload className="w-4 h-4 text-info" />;
      case 'error': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getSourceIcon = (source: string) => {
    switch(source) {
      case 'iot': return <Wifi className="w-4 h-4 text-success" />;
      case 'cloud': return <Cloud className="w-4 h-4 text-info" />;
      case 'manual': return <Upload className="w-4 h-4 text-primary" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return 'Live Stream';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadStats = {
    totalFiles: uploadedFiles.length,
    completedFiles: uploadedFiles.filter(f => f.status === 'completed').length,
    totalSize: uploadedFiles.reduce((acc, file) => acc + file.size, 0),
    activeStreams: uploadedFiles.filter(f => f.source === 'iot' && f.status === 'completed').length,
  };

  return (
    <DashboardLayout 
      title="Data Upload Center" 
      subtitle="Upload sensor data, drone imagery, and integrate with IoT systems"
    >
      {/* Upload Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{uploadStats.totalFiles}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">{uploadStats.completedFiles}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">{formatFileSize(uploadStats.totalSize)}</p>
              </div>
              <HardDrive className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live Streams</p>
                <p className="text-2xl font-bold text-warning">{uploadStats.activeStreams}</p>
              </div>
              <Wifi className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">File Upload</TabsTrigger>
          <TabsTrigger value="iot">IoT Integration</TabsTrigger>
          <TabsTrigger value="cloud">Cloud Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Drag & Drop Upload Area */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                File Upload
              </CardTitle>
              <CardDescription>
                Drag and drop files or click to browse. Supports CSV, ZIP, JSON, and image files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  {isDragActive ? (
                    <div>
                      <h3 className="text-lg font-semibold">Drop files here</h3>
                      <p className="text-muted-foreground">Release to upload your files</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold">Drop files here or click to browse</h3>
                      <p className="text-muted-foreground">
                        Supported formats: CSV (sensor logs), ZIP (drone/LiDAR), Images, JSON
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Badge variant="outline">CSV</Badge>
                    <Badge variant="outline">ZIP</Badge>
                    <Badge variant="outline">JSON</Badge>
                    <Badge variant="outline">Images</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Upload Form */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Upload Details</CardTitle>
              <CardDescription>
                Provide additional information about your upload
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source-zone">Source Zone</Label>
                  <Input 
                    id="source-zone" 
                    placeholder="e.g., Zone Z-001 (North Pit)"
                  />
                </div>
                <div>
                  <Label htmlFor="data-type">Data Type</Label>
                  <Input 
                    id="data-type" 
                    placeholder="e.g., Sensor Logs, Drone Survey"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Brief description of the data being uploaded..."
                  rows={3}
                />
              </div>
              <Button className="btn-industrial">
                <Upload className="w-4 h-4 mr-2" />
                Start Upload
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="iot" className="space-y-6">
          {/* IoT Sensor Integration */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                IoT Sensor Integration
              </CardTitle>
              <CardDescription>
                Real-time data feeds from mining sensors and monitoring equipment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Live Data Streams */}
              <div>
                <h4 className="font-medium mb-4">Active Data Streams</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 border border-border/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Ground Vibration Sensors</h5>
                      <Badge className="bg-success/20 text-success">Active</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sensors Connected:</span>
                        <span className="font-medium">12/15</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Rate:</span>
                        <span className="font-medium">1Hz</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Update:</span>
                        <span className="font-medium">2 sec ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Tilt Monitoring</h5>
                      <Badge className="bg-warning/20 text-warning">Degraded</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sensors Connected:</span>
                        <span className="font-medium">8/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Rate:</span>
                        <span className="font-medium">0.1Hz</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Update:</span>
                        <span className="font-medium">30 sec ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Crack Monitors</h5>
                      <Badge className="bg-success/20 text-success">Active</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sensors Connected:</span>
                        <span className="font-medium">25/25</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Rate:</span>
                        <span className="font-medium">0.5Hz</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Update:</span>
                        <span className="font-medium">1 sec ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Weather Station</h5>
                      <Badge className="bg-success/20 text-success">Active</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sensors Connected:</span>
                        <span className="font-medium">1/1</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Rate:</span>
                        <span className="font-medium">0.01Hz</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Update:</span>
                        <span className="font-medium">60 sec ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* IoT Configuration */}
              <div>
                <h4 className="font-medium mb-4">Configuration</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="endpoint">Data Endpoint</Label>
                    <Input 
                      id="endpoint" 
                      value="wss://sensors.minesentinel.com/stream"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key" 
                      type="password"
                      value="••••••••••••••••••••••••••••••••"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline">
                    Test Connection
                  </Button>
                  <Button variant="outline">
                    Refresh Sensors
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cloud" className="space-y-6">
          {/* Cloud Storage Integration */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Cloud Storage Integration
              </CardTitle>
              <CardDescription>
                Connect with cloud storage providers and edge gateways
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cloud Providers */}
              <div>
                <h4 className="font-medium mb-4">Connected Storage</h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="p-4 border border-border/50 rounded-lg text-center">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Cloud className="w-6 h-6 text-blue-500" />
                    </div>
                    <h5 className="font-medium">AWS S3</h5>
                    <p className="text-sm text-muted-foreground">Connected</p>
                    <Badge className="bg-success/20 text-success mt-2">Active</Badge>
                  </div>

                  <div className="p-4 border border-border/50 rounded-lg text-center">
                    <div className="w-12 h-12 bg-gray-500/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <HardDrive className="w-6 h-6 text-gray-500" />
                    </div>
                    <h5 className="font-medium">Edge Gateway</h5>
                    <p className="text-sm text-muted-foreground">Local Storage</p>
                    <Badge className="bg-success/20 text-success mt-2">Online</Badge>
                  </div>

                  <div className="p-4 border border-border/50 rounded-lg text-center">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Cloud className="w-6 h-6 text-orange-500" />
                    </div>
                    <h5 className="font-medium">Azure Blob</h5>
                    <p className="text-sm text-muted-foreground">Not Connected</p>
                    <Badge variant="outline" className="mt-2">Setup</Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="btn-industrial">
                  <Cloud className="w-4 h-4 mr-2" />
                  Add Storage Provider
                </Button>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Configure Edge Gateway
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Uploaded Files List */}
      <Card className="glass-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Uploads ({uploadedFiles.length})
            </CardTitle>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  {getSourceIcon(file.source)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{file.name}</span>
                      <Badge variant="outline">{file.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.uploadedAt}</span>
                      <span className="capitalize">{file.source}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {file.status === 'uploading' && (
                    <div className="w-20">
                      <Progress value={file.progress} className="h-2" />
                    </div>
                  )}
                  {getStatusIcon(file.status)}
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                    {file.source === 'manual' && (
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}