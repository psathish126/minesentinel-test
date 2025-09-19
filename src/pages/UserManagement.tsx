import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Settings,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'safety_officer' | 'field_operator' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  department: string;
  phone?: string;
  location?: string;
  permissions: string[];
  createdAt: string;
  avatar?: string;
}

const emptyUsers: User[] = [];

const rolePermissions = {
  admin: ['all_access', 'user_management', 'system_settings', 'delete_data'],
  safety_officer: ['view_alerts', 'create_reports', 'manage_zones', 'emergency_actions'],
  field_operator: ['view_sensors', 'upload_data', 'view_maps', 'basic_reports'],
  viewer: ['view_dashboard', 'view_reports']
};

export default function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(emptyUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'field_operator' as User['role'],
    department: '',
    phone: '',
    location: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'destructive';
      case 'safety_officer': return 'default';
      case 'field_operator': return 'secondary';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'pending': return 'default';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-muted-foreground" />;
      case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: User = {
        id: `USR-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'pending',
        lastLogin: 'Never',
        department: newUser.department,
        phone: newUser.phone,
        location: newUser.location,
        permissions: rolePermissions[newUser.role],
        createdAt: new Date().toISOString(),
      };

      setUsers(prev => [user, ...prev]);
      setShowAddUserDialog(false);
      setNewUser({
        name: '',
        email: '',
        role: 'field_operator',
        department: '',
        phone: '',
        location: ''
      });

      toast({
        title: "User Added",
        description: `${user.name} has been added successfully. Invitation email sent.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      toast({
        title: "User Deleted",
        description: "User has been removed from the system.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' as User['status'] }
          : user
      ));
      
      toast({
        title: "User Status Updated",
        description: "User status has been changed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const formatRoleName = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <DashboardLayout 
      title="User Management" 
      subtitle="Manage user accounts, roles, and permissions"
    >
      {/* User Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{userStats.total}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-success">{userStats.active}</p>
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
                <p className="text-2xl font-bold text-warning">{userStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Administrators</p>
                <p className="text-2xl font-bold text-destructive">{userStats.admins}</p>
              </div>
              <Shield className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Accounts</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Header Actions */}
          <Card className="glass-panel">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage user accounts and access permissions
                  </CardDescription>
                </div>
                <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                  <DialogTrigger asChild>
                    <Button className="btn-industrial">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account and send invitation email.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={newUser.name}
                            onChange={(e) => setNewUser(prev => ({...prev, name: e.target.value}))}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser(prev => ({...prev, email: e.target.value}))}
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="role">Role *</Label>
                          <Select 
                            value={newUser.role} 
                            onValueChange={(value: User['role']) => setNewUser(prev => ({...prev, role: value}))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrator</SelectItem>
                              <SelectItem value="safety_officer">Safety Officer</SelectItem>
                              <SelectItem value="field_operator">Field Operator</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            value={newUser.department}
                            onChange={(e) => setNewUser(prev => ({...prev, department: e.target.value}))}
                            placeholder="Safety & Operations"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={newUser.phone}
                            onChange={(e) => setNewUser(prev => ({...prev, phone: e.target.value}))}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newUser.location}
                            onChange={(e) => setNewUser(prev => ({...prev, location: e.target.value}))}
                            placeholder="Mine Site A"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleAddUser} 
                        disabled={isLoading}
                        className="btn-industrial flex-1"
                      >
                        {isLoading ? "Adding..." : "Add User"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddUserDialog(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name, email, or department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="safety_officer">Safety Officer</SelectItem>
                    <SelectItem value="field_operator">Field Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          {filteredUsers.length === 0 ? (
            <Card className="glass-panel">
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
                <p className="text-muted-foreground mb-4">
                  {users.length === 0 
                    ? "Get started by adding your first user to the system."
                    : "No users match your current search and filter criteria."
                  }
                </p>
                <Button onClick={() => setShowAddUserDialog(true)} className="btn-industrial">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add First User
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="glass-panel hover:bg-muted/10 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge variant={getRoleColor(user.role) as any}>
                              {formatRoleName(user.role)}
                            </Badge>
                            <Badge variant={getStatusColor(user.status) as any}>
                              {user.status.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            {user.department && (
                              <div className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                <span>{user.department}</span>
                              </div>
                            )}
                            {user.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{user.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Last login: {user.lastLogin}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.status)}
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleToggleUserStatus(user.id)}
                          >
                            {user.status === 'active' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* User Permissions */}
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Key className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Permissions:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Role Management
              </CardTitle>
              <CardDescription>
                Configure user roles and their associated permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(rolePermissions).map(([role, permissions]) => (
                  <div key={role} className="p-4 border border-border/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{formatRoleName(role)}</h4>
                      <Badge variant={getRoleColor(role) as any}>
                        {users.filter(u => u.role === role).length} users
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <h5 className="text-sm font-medium text-muted-foreground">Permissions:</h5>
                      <div className="space-y-1">
                        {permissions.map((permission, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-success" />
                            <span>{permission.replace('_', ' ').toUpperCase()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button size="sm" variant="outline" className="w-full">
                      <Settings className="w-3 h-3 mr-1" />
                      Edit Permissions
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                User Activity Logs
              </CardTitle>
              <CardDescription>
                Monitor user login activity and system access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Activity Logs</h3>
                <p className="text-muted-foreground">
                  User activity logs will appear here once users start accessing the system.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}