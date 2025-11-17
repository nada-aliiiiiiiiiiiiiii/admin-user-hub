import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Shield, Save } from 'lucide-react';

export default function UserProfile() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would call an API to update the profile
    toast({
      title: 'Coming Soon',
      description: 'Profile update functionality will be available soon',
    });
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-semibold">
              {user.name?.[0] || user.email[0]}
            </div>
            <div className="space-y-1">
              <p className="text-xl font-semibold">{user.name || 'User'}</p>
              <div className="flex items-center gap-2">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="name">
                <User className="h-4 w-4 inline mr-2" />
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                disabled
              />
              <p className="text-sm text-muted-foreground">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="text-2xl font-semibold">2024</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Posts Created</p>
              <p className="text-2xl font-semibold">-</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Likes</p>
              <p className="text-2xl font-semibold">-</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
