import { useState, useEffect } from 'react';
import { authService } from '@/services/api/authService';
import { paymentService } from '@/services/api/paymentService';
import { Payment } from '@/models/payment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Calendar, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;

      try {
        const data = await paymentService.getHistory(user.id);
        setPayments(data);
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

    fetchPayments();
  }, []);

  const getStatusBadge = (status: Payment['status']) => {
    const variants: Record<Payment['status'], 'default' | 'secondary' | 'destructive'> = {
      confirmed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      cancelled: 'destructive',
    };

    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">Loading payment history...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground">View all your payment transactions</p>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No payment history found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{payment.type}</CardTitle>
                  {getStatusBadge(payment.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">${payment.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                {payment.referenceId && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>Reference: {payment.referenceId}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
