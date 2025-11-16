import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Powerful platform management system with full-featured admin controls
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
          <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
            <LayoutDashboard className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Comprehensive Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Monitor all platform metrics and activities in real-time
            </p>
          </div>
          
          <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
            <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Secure Authentication</h3>
            <p className="text-sm text-muted-foreground">
              JWT-based authentication with role-based access control
            </p>
          </div>
          
          <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
            <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Full Module Management</h3>
            <p className="text-sm text-muted-foreground">
              Complete CRUD operations for all platform features
            </p>
          </div>
        </div>

        <div className="pt-8">
          <Button
            size="lg"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
            className="text-lg px-8"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
