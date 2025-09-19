import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon,
  Clock, 
  Eye,
  Send,
  Trash2,
  Plus,
  AlertTriangle,
  TrendingUp,
  Activity,
  MapPin,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Settings
} from "lucide-react";
import { format } from "date-fns";

interface Report {
  id: string;
  title: string;
  type: 'safety' | 'incident' | 'performance' | 'maintenance' | 'compliance';
  status: 'draft' | 'pending' | 'completed' | 'approved';
  createdAt: string;
  completedAt?: string;
  author: string;
  description: string;
  zones: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  size: string;
  recipient?: string;
}

const mockReports: Report[] = [
  {
    id: 'RPT-001',
    title: 'Daily Safety Assessment Report',
    type: 'safety',
    status: 'completed',
    createdAt: '2024-01-19 08:00',
    completedAt: '2024-01-19 08:15',
    author: 'Safety Supervisor',
    description: 'Comprehensive daily safety report covering all mining zones with risk assessments and recommendations.',
    zones: ['Zone Z-001', 'Zone Z-002', 'Zone Z-003', 'Zone Z-004'],
    priority: 'high',
    size: '2.4 MB',
    recipient: 'management@minesentinel.com'
  },
  {
    id: 'RPT-002',
    title: 'East Wall Critical Incident Report',
    type: 'incident',
    status: 'approved',
    createdAt: '2024-01-19 10:30',
    completedAt: '2024-01-19 11:45',
    author: 'Mine Safety Officer',
    description: 'Detailed incident report for critical rockfall risk detected in East Wall zone.',
    zones: ['Zone Z-003'],
    priority: 'critical',
    size: '5.7 MB',
    recipient: 'regulatory@mining.gov'
  },
  {
    id: 'RPT-003',
    title: 'Weekly AI Performance Analysis',
    type: 'performance',
    status: 'pending',
    createdAt: '2024-01-19 06:00',
    author: 'AI System Administrator',
    description: 'Weekly analysis of AI prediction accuracy, system performance metrics, and model optimization recommendations.',
    zones: ['All Zones'],
    priority: 'medium',
    size: '1.8 MB'
  },
  {
    id: 'RPT-004',
    title: 'Sensor Maintenance Schedule',
    type: 'maintenance',
    status: 'draft',
    createdAt: '2024-01-19 07:30',
    author: 'Maintenance Supervisor',
    description: 'Monthly maintenance schedule for all sensor equipment including calibration and replacement requirements.',
    zones: ['Zone Z-001', 'Zone Z-002'],
    priority: 'low',
    size: '892 KB'
  },
];

const reportTemplates = [
  { id: 'daily-safety', name: 'Daily Safety Report', description: 'Standard daily safety assessment' },
  { id: 'incident', name: 'Incident Report', description: 'Emergency incident documentation' },
  { id: 'performance', name: 'AI Performance Report', description: 'System performance analysis' },
  { id: 'maintenance', name: 'Maintenance Report', description: 'Equipment maintenance tracking' },
  { id: 'compliance', name: 'Compliance Report', description: 'Regulatory compliance documentation' },
];

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showNewReportForm, setShowNewReportForm] = useState(false);

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'success';
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-primary" />;
      case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      case 'draft': return <FileText className="w-4 h-4 text-muted-foreground" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'safety': return <AlertTriangle className="w-4 h-4" />;
      case 'incident': return <XCircle className="w-4 h-4" />;
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      case 'maintenance': return <Activity className="w-4 h-4" />;
      case 'compliance': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const reportStats = {
    total: mockReports.length,
    completed: mockReports.filter(r => r.status === 'completed').length,
    pending: mockReports.filter(r => r.status === 'pending').length,
    overdue: 0, // Mock calculation
  };

  const handleDownloadReport = (reportId: string) => {
    console.log('Downloading report:', reportId);
    // In a real app, this would download the report file
  };

  const handleDeleteReport = (reportId: string) => {
    console.log('Deleting report:', reportId);
    // In a real app, this would delete the report
  };

  const handleGenerateReport = (templateId: string) => {
    console.log('Generating report from template:', templateId);
    setShowNewReportForm(false);
    // In a real app, this would create a new report
  };

  return (
    <DashboardLayout 
      title="Reports & Documentation" 
      subtitle="Generate, manage, and distribute safety and compliance reports"
    >
      {/* Report Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{reportStats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">{reportStats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{reportStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-destructive">{reportStats.overdue}</p>
              </div>
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Quick Report Generation
          </CardTitle>
          <CardDescription>
            Generate reports from predefined templates or create custom reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {reportTemplates.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="h-auto p-3 flex flex-col gap-2"
                onClick={() => handleGenerateReport(template.id)}
              >
                {getTypeIcon(template.id.split('-')[0])}
                <div className="text-center">
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-muted-foreground">{template.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Report Library</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          {/* Filter and Search */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter & Search Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports by title, description, or ID..."
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-40">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="glass-panel hover:bg-muted/10 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getTypeIcon(report.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{report.title}</h3>
                          <Badge variant={getStatusColor(report.status) as any}>
                            {report.status.toUpperCase()}
                          </Badge>
                          <Badge variant={getPriorityColor(report.priority) as any}>
                            {report.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>ID: {report.id}</span>
                          <span>Size: {report.size}</span>
                          <span>Author: {report.author}</span>
                          {report.recipient && <span>Sent to: {report.recipient}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusIcon(report.status)}
                      <div className="text-xs text-muted-foreground mt-1">
                        Created: {report.createdAt}
                      </div>
                      {report.completedAt && (
                        <div className="text-xs text-muted-foreground">
                          Completed: {report.completedAt}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Zones */}
                  <div className="mb-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>Zones Covered:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {report.zones.map((zone, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {zone}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    {report.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <Send className="w-3 h-3 mr-1" />
                        Send
                      </Button>
                    )}
                    {report.status === 'draft' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <Card className="glass-panel">
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
                <p className="text-muted-foreground mb-4">
                  No reports match your current filters. Try adjusting your search criteria.
                </p>
                <Button onClick={() => setShowNewReportForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Report
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {/* Scheduled Reports */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Automated Report Schedule
              </CardTitle>
              <CardDescription>
                Configure and manage automated report generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-border/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Daily Safety Assessment</h4>
                    <Badge className="bg-success/20 text-success">Active</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    Generates comprehensive daily safety reports at 8:00 AM every day
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span>Frequency: Daily</span>
                    <span>Next run: Tomorrow 8:00 AM</span>
                    <span>Recipients: 3</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>

                <div className="p-4 border border-border/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Weekly Performance Summary</h4>
                    <Badge className="bg-success/20 text-success">Active</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    AI performance and system metrics report generated every Monday
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span>Frequency: Weekly</span>
                    <span>Next run: Monday 6:00 AM</span>
                    <span>Recipients: 2</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button className="btn-industrial">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {/* Report Templates */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Report Templates
              </CardTitle>
              <CardDescription>
                Customize and manage report templates for consistent documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <div key={template.id} className="p-4 border border-border/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      {getTypeIcon(template.id.split('-')[0])}
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        className="btn-industrial flex-1"
                        onClick={() => handleGenerateReport(template.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Custom Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}