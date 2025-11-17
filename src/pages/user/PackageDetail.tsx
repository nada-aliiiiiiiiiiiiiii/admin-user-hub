import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { packageService } from '@/services/api/packageService';
import { paymentService } from '@/services/api/paymentService';
import { Package } from '@/models/package';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle2, ShoppingCart } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function PackageDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPackage = async () => {
      if (!id) return;

      try {
        const data = await packageService.getById(id);
        setPkg(data);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/user/packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const handlePurchase = async () => {
    if (!id) return;

    try {
      setPurchasing(true);

      // Initiate payment
      const payment = await paymentService.initiate({
        amount: pkg!.price,
        type: 'package',
        referenceId: id,
      });

      // In a real app, you would redirect to a payment gateway here
      // For now, we'll simulate payment confirmation
      await paymentService.confirm({
        paymentId: payment.id,
        transactionId: `TXN-${Date.now()}`,
      });

      // Purchase the package
      await packageService.purchase({ packageId: id });

      toast({
        title: 'Success',
        description: 'Package purchased successfully!',
      });

      navigate('/user/packages');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setPurchasing(false);
      setConfirmDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">Loading package...</div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Package not found</p>
        <Link to="/user/packages">
          <Button variant="outline">Back to Packages</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/user/packages">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Packages
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{pkg.name}</CardTitle>
          {pkg.description && (
            <p className="text-muted-foreground text-lg">{pkg.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold">${pkg.price}</p>
            <p className="text-muted-foreground">for {pkg.duration} days</p>
          </div>

          {pkg.features && pkg.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Features</h3>
              <ul className="space-y-3">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={() => setConfirmDialogOpen(true)}
            disabled={!pkg.isActive || purchasing}
          >
            <ShoppingCart className="h-5 w-5" />
            {pkg.isActive ? 'Purchase Package' : 'Not Available'}
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to purchase <strong>{pkg.name}</strong> for ${pkg.price}?
              This package will be valid for {pkg.duration} days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={purchasing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePurchase} disabled={purchasing}>
              {purchasing ? 'Processing...' : 'Confirm Purchase'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
