import { useState, useEffect } from 'react';
import { authService } from '@/services/api/authService';
import { diamondService } from '@/services/api/diamondService';
import { DiamondPackage, UserDiamond, DiamondTransaction } from '@/models/diamond';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Gem, ShoppingCart, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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

export default function DiamondWallet() {
  const [balance, setBalance] = useState<UserDiamond | null>(null);
  const [packages, setPackages] = useState<DiamondPackage[]>([]);
  const [transactions, setTransactions] = useState<DiamondTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<DiamondPackage | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const { toast } = useToast();
  const user = authService.getCurrentUser();

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [balanceData, packagesData, transactionsData] = await Promise.all([
        diamondService.getUserBalance(user.id),
        diamondService.getPackages(),
        diamondService.getTransactions(user.id),
      ]);
      setBalance(balanceData);
      setPackages(packagesData.filter(p => p.isActive));
      setTransactions(transactionsData);
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

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    try {
      setPurchasing(true);
      await diamondService.purchasePackage({ packageId: selectedPackage.id });
      toast({
        title: 'Success',
        description: `Successfully purchased ${selectedPackage.amount} diamonds!`,
      });
      fetchData();
      setSelectedPackage(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Diamond Wallet</h1>
        <p className="text-muted-foreground">Manage your diamond balance and purchase packages</p>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gem className="h-6 w-6 text-primary" />
            Your Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold">{balance?.balance || 0}</p>
          <p className="text-muted-foreground mt-2">Available Diamonds</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Diamond Packages</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gem className="h-5 w-5 text-primary" />
                  {pkg.name}
                </CardTitle>
                {pkg.description && (
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold">{pkg.amount}</p>
                  <p className="text-sm text-muted-foreground">Diamonds</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">${pkg.price}</p>
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Purchase
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Transaction History</h2>
        {transactions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No transactions yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {transactions.map((txn) => (
              <Card key={txn.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {txn.type === 'add' || txn.type === 'purchase' ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {txn.type === 'add' || txn.type === 'purchase' ? '+' : '-'}
                          {txn.amount} diamonds
                        </p>
                        {txn.description && (
                          <p className="text-sm text-muted-foreground">{txn.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {txn.type}
                      </Badge>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(txn.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={!!selectedPackage}
        onOpenChange={(open) => !open && setSelectedPackage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to purchase <strong>{selectedPackage?.name}</strong> for $
              {selectedPackage?.price}? You will receive {selectedPackage?.amount} diamonds.
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
