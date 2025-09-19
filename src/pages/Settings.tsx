import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Wifi,
  Monitor,
  Palette,
  Globe,
  Mail,
  Phone,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Trash2,
  Key,
  Clock,
  Volume2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    siteName: "Mine Sentinel",
    alertThreshold: "medium",
    autoBackup: true,
    maintenanceMode: false,
    dataRetention: "90",
    timezone: "America/Los_Angeles",
    language: "en",
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    soundEnabled: true,
    criticalOnly: false,
    quietHours: false,
    quietStart: "22:00",
    quietEnd: "06:00",
  });

  // AI Settings State
  const [aiSettings, setAiSettings] = useState({
    modelVersion: "v2.1.3",
    predictionInterval: "15",
    confidenceThreshold: "75",
    autoRetraining: true,
    explainableAI: true,
    fallbackMode: "conservative",
  });

  // Integration Settings State
  const [integrationSettings, setIntegrationSettings] = useState({
    apiEndpoint: "",
    webhookUrl: "",
    backupLocation: "local",
    cloudProvider: "",
    syncInterval: "5",
  });

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: `${section} settings have been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSettings = () => {
    const settings = {
      system: systemSettings,
      notifications: notificationSettings,
      ai: aiSettings,
      integrations: integrationSettings,
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mine-sentinel-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Settings Exported",
      description: "Configuration has been exported successfully.",
    });
  };

  const handleResetToDefault = (section: string) => {
    if (confirm(`Are you sure you want to reset ${section} settings to default values?`)) {
      switch (section) {
        case 'system':
          setSystemSettings({
            siteName: "Mine Sentinel",
            alertThreshold: "medium",
            autoBackup: true,
            maintenanceMode: false,
            dataRetention: "90",
            timezone: "America/Los_Angeles",
            language: "en",
          });
          break;
        case 'notifications':
          setNotificationSettings({
            emailAlerts: true,
            smsAlerts: false,
            pushNotifications: true,
            soundEnabled: true,
            criticalOnly: false,
            quietHours: false,
            quietStart: "22:00",
            quietEnd: "06:00",
          });
          break;
        case 'ai':
          setAiSettings({
            modelVersion: "v2.1.3",
            predictionInterval: "15",
            confidenceThreshold: "75",
            autoRetraining: true,
            explainableAI: true,
            fallbackMode: "conservative",
          });
          break;
      }
      
      toast({
        title: "Settings Reset",
        description: `${section} settings have been reset to default values.`,
      });
    }
  };

  return (
    <DashboardLayout 
      title="System Settings" 
      subtitle="Configure system preferences, notifications, and integrations"
    >
      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai">AI Configuration</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                General System Settings
              </CardTitle>
              <CardDescription>
                Configure basic system parameters and operational settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings(prev => ({...prev, siteName: e.target.value}))}
                      placeholder="Mine Sentinel"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={systemSettings.timezone} 
                      onValueChange={(value) => setSystemSettings(prev => ({...prev, timezone: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={systemSettings.language} 
                      onValueChange={(value) => setSystemSettings(prev => ({...prev, language: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="alertThreshold">Default Alert Threshold</Label>
                    <Select 
                      value={systemSettings.alertThreshold} 
                      onValueChange={(value) => setSystemSettings(prev => ({...prev, alertThreshold: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select threshold" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (20%)</SelectItem>
                        <SelectItem value="medium">Medium (50%)</SelectItem>
                        <SelectItem value="high">High (75%)</SelectItem>
                        <SelectItem value="critical">Critical (90%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dataRetention">Data Retention (Days)</Label>
                    <Input
                      id="dataRetention"
                      type="number"
                      value={systemSettings.dataRetention}
                      onChange={(e) => setSystemSettings(prev => ({...prev, dataRetention: e.target.value}))}
                      placeholder="90"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto Backup</Label>
                        <p className="text-sm text-muted-foreground">Automatically backup system data</p>
                      </div>
                      <Switch
                        checked={systemSettings.autoBackup}
                        onCheckedChange={(checked) => setSystemSettings(prev => ({...prev, autoBackup: checked}))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable system maintenance mode</p>
                      </div>
                      <Switch
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(checked) => setSystemSettings(prev => ({...prev, maintenanceMode: checked}))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSaveSettings('System')} 
                  disabled={isLoading}
                  className="btn-industrial"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleResetToDefault('system')}
                >
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how and when you receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Alert Channels</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailAlerts}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, emailAlerts: checked}))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsAlerts}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, smsAlerts: checked}))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, pushNotifications: checked}))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Alert Preferences</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sound Notifications</Label>
                      <p className="text-sm text-muted-foreground">Play sound for alerts</p>
                    </div>
                    <Switch
                      checked={notificationSettings.soundEnabled}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, soundEnabled: checked}))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Critical Only</Label>
                      <p className="text-sm text-muted-foreground">Only notify for critical alerts</p>
                    </div>
                    <Switch
                      checked={notificationSettings.criticalOnly}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, criticalOnly: checked}))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Quiet Hours</Label>
                      <p className="text-sm text-muted-foreground">Reduce notifications during off-hours</p>
                    </div>
                    <Switch
                      checked={notificationSettings.quietHours}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, quietHours: checked}))}
                    />
                  </div>

                  {notificationSettings.quietHours && (
                    <div className="grid grid-cols-2 gap-4 ml-4">
                      <div>
                        <Label htmlFor="quietStart">Start Time</Label>
                        <Input
                          id="quietStart"
                          type="time"
                          value={notificationSettings.quietStart}
                          onChange={(e) => setNotificationSettings(prev => ({...prev, quietStart: e.target.value}))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="quietEnd">End Time</Label>
                        <Input
                          id="quietEnd"
                          type="time"
                          value={notificationSettings.quietEnd}
                          onChange={(e) => setNotificationSettings(prev => ({...prev, quietEnd: e.target.value}))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSaveSettings('Notification')} 
                  disabled={isLoading}
                  className="btn-industrial"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleResetToDefault('notifications')}
                >
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                AI Configuration
              </CardTitle>
              <CardDescription>
                Configure AI model settings and prediction parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Current Model Version</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{aiSettings.modelVersion}</Badge>
                      <Badge className="bg-success/20 text-success">Active</Badge>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="predictionInterval">Prediction Interval (minutes)</Label>
                    <Input
                      id="predictionInterval"
                      type="number"
                      value={aiSettings.predictionInterval}
                      onChange={(e) => setAiSettings(prev => ({...prev, predictionInterval: e.target.value}))}
                      placeholder="15"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confidenceThreshold">Confidence Threshold (%)</Label>
                    <Input
                      id="confidenceThreshold"
                      type="number"
                      value={aiSettings.confidenceThreshold}
                      onChange={(e) => setAiSettings(prev => ({...prev, confidenceThreshold: e.target.value}))}
                      placeholder="75"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fallbackMode">Fallback Mode</Label>
                    <Select 
                      value={aiSettings.fallbackMode} 
                      onValueChange={(value) => setAiSettings(prev => ({...prev, fallbackMode: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fallback mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Retraining</Label>
                      <p className="text-sm text-muted-foreground">Automatically retrain models with new data</p>
                    </div>
                    <Switch
                      checked={aiSettings.autoRetraining}
                      onCheckedChange={(checked) => setAiSettings(prev => ({...prev, autoRetraining: checked}))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Explainable AI</Label>
                      <p className="text-sm text-muted-foreground">Provide explanations for AI decisions</p>
                    </div>
                    <Switch
                      checked={aiSettings.explainableAI}
                      onCheckedChange={(checked) => setAiSettings(prev => ({...prev, explainableAI: checked}))}
                    />
                  </div>

                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-medium mb-2">Model Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Accuracy:</span>
                        <span className="font-medium text-success">91.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Training:</span>
                        <span className="font-medium">2 days ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Training:</span>
                        <span className="font-medium">In 5 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSaveSettings('AI')} 
                  disabled={isLoading}
                  className="btn-industrial"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Configuration
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleResetToDefault('ai')}
                >
                  Reset to Default
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Model
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                External Integrations
              </CardTitle>
              <CardDescription>
                Configure connections to external systems and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiEndpoint">API Endpoint</Label>
                    <Input
                      id="apiEndpoint"
                      value={integrationSettings.apiEndpoint}
                      onChange={(e) => setIntegrationSettings(prev => ({...prev, apiEndpoint: e.target.value}))}
                      placeholder="https://api.example.com/v1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      value={integrationSettings.webhookUrl}
                      onChange={(e) => setIntegrationSettings(prev => ({...prev, webhookUrl: e.target.value}))}
                      placeholder="https://hooks.example.com/webhook"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cloudProvider">Cloud Provider</Label>
                    <Select 
                      value={integrationSettings.cloudProvider} 
                      onValueChange={(value) => setIntegrationSettings(prev => ({...prev, cloudProvider: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="aws">Amazon Web Services</SelectItem>
                        <SelectItem value="azure">Microsoft Azure</SelectItem>
                        <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backupLocation">Backup Location</Label>
                    <Select 
                      value={integrationSettings.backupLocation} 
                      onValueChange={(value) => setIntegrationSettings(prev => ({...prev, backupLocation: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local Storage</SelectItem>
                        <SelectItem value="cloud">Cloud Storage</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="syncInterval">Sync Interval (minutes)</Label>
                    <Input
                      id="syncInterval"
                      type="number"
                      value={integrationSettings.syncInterval}
                      onChange={(e) => setIntegrationSettings(prev => ({...prev, syncInterval: e.target.value}))}
                      placeholder="5"
                    />
                  </div>

                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-medium mb-2">Connection Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>API Connection:</span>
                        <Badge className="bg-success/20 text-success">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Cloud Backup:</span>
                        <Badge variant="outline">Not Configured</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Webhook:</span>
                        <Badge variant="outline">Not Configured</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSaveSettings('Integration')} 
                  disabled={isLoading}
                  className="btn-industrial"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Integration
                </Button>
                <Button variant="outline">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      API Keys
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Primary API Key</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">Active</Badge>
                          <Button size="sm" variant="outline">Regenerate</Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Backup API Key</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">Inactive</Badge>
                          <Button size="sm" variant="outline">Activate</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border/50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Session Management
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Session Timeout:</span>
                        <span>8 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Concurrent Sessions:</span>
                        <span>3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Sessions:</span>
                        <span>1</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h4 className="font-medium mb-2">Security Policies</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-xs text-muted-foreground">Require 2FA for all users</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Password Complexity</Label>
                          <p className="text-xs text-muted-foreground">Enforce strong passwords</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Login Attempt Limit</Label>
                          <p className="text-xs text-muted-foreground">Lock accounts after failed attempts</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border/50 rounded-lg">
                    <h4 className="font-medium mb-2">Audit Logs</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Log Retention:</span>
                        <span>1 year</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Log Size:</span>
                        <span>45.2 MB</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-2">
                        <Download className="w-3 h-3 mr-1" />
                        Export Audit Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button className="btn-industrial">
                  <Save className="w-4 h-4 mr-2" />
                  Save Security Settings
                </Button>
                <Button variant="outline">
                  Run Security Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export/Import Configuration */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Configuration Management
          </CardTitle>
          <CardDescription>
            Export, import, or reset system configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportSettings}>
              <Download className="w-4 h-4 mr-2" />
              Export Configuration
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import Configuration
            </Button>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Factory Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}