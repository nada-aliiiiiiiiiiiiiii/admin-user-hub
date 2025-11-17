import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { packageService } from '@/services/api/packageService';
import { authService } from '@/services/api/authService';
import { Package, UserPackage } from '@/models/package';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Package as PackageIcon, CheckCircle2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function UserPackages() {
  const [availablePackages, setAvailablePackages] = useState<Package[]>([]);
  const [userPackages, setUserPackages] = useState<UserPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const user = authService.getCurrentUser();

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [packages, myPackages] = await Promise.all([
        packageService.getAll(),
        packageService.getUserPackages(user.id),
      ]);
      setAvailablePackages(packages.filter(p => p.isActive));
      setUserPackages(myPackages);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">Loading packages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Packages</h1>
        <p className="text-muted-foreground">Browse and manage your subscription packages</p>
      </div>

      {userPackages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">My Active Packages</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userPackages.map((pkg) => (
              <Card key={pkg.id} className="border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.packageName}</CardTitle>
                    <Badge variant={pkg.isActive ? 'default' : 'secondary'}>
                      {pkg.isActive ? 'Active' : 'Expired'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Started {formatDistanceToNow(new Date(pkg.startDate), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Expires {formatDistanceToNow(new Date(pkg.endDate), { addSuffix: true })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Available Packages</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availablePackages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <PackageIcon className="h-5 w-5 text-primary" />
                  <CardTitle>{pkg.name}</CardTitle>
                </div>
                {pkg.description && (
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold">${pkg.price}</p>
                  <p className="text-sm text-muted-foreground">{pkg.duration} days</p>
                </div>
                {pkg.features && pkg.features.length > 0 && (
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter>
                <Link to={`/user/package/${pkg.id}`} className="w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
