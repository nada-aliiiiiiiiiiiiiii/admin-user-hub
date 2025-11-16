import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LayoutDashboard,
  Users,
  FileText,
  TrendingUp,
  Diamond,
  CreditCard,
  MessageSquare,
  Heart,
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,547',
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Total Posts',
      value: '1,234',
      change: '+8.2%',
      icon: FileText,
      color: 'text-green-500',
    },
    {
      title: 'Comments',
      value: '5,678',
      change: '+15.3%',
      icon: MessageSquare,
      color: 'text-purple-500',
    },
    {
      title: 'Likes',
      value: '12,345',
      change: '+20.1%',
      icon: Heart,
      color: 'text-red-500',
    },
    {
      title: 'Diamond Sales',
      value: '$45,231',
      change: '+18.7%',
      icon: Diamond,
      color: 'text-cyan-500',
    },
    {
      title: 'Revenue',
      value: '$89,432',
      change: '+22.5%',
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
    {
      title: 'Packages Sold',
      value: '234',
      change: '+5.2%',
      icon: CreditCard,
      color: 'text-orange-500',
    },
    {
      title: 'Active Projects',
      value: '89',
      change: '+3.1%',
      icon: LayoutDashboard,
      color: 'text-indigo-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your platform's performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New user registered', time: '5 minutes ago' },
                { action: 'Post published', time: '15 minutes ago' },
                { action: 'Payment received', time: '1 hour ago' },
                { action: 'ID verification approved', time: '2 hours ago' },
                { action: 'Feedback submitted', time: '3 hours ago' },
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-sm">{activity.action}</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-left">
                <FileText className="h-5 w-5 mb-2 text-primary" />
                <div className="text-sm font-medium">Create Post</div>
              </button>
              <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-left">
                <Users className="h-5 w-5 mb-2 text-primary" />
                <div className="text-sm font-medium">Add User</div>
              </button>
              <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-left">
                <Diamond className="h-5 w-5 mb-2 text-primary" />
                <div className="text-sm font-medium">Add Package</div>
              </button>
              <button className="p-4 border rounded-lg hover:bg-muted transition-colors text-left">
                <CreditCard className="h-5 w-5 mb-2 text-primary" />
                <div className="text-sm font-medium">View Payments</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
