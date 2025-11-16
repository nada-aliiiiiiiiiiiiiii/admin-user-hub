import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { userNationalIdService } from '@/services/api/userNationalIdService';
import { UserNationalId } from '@/models/userNationalId';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const IDVerification = () => {
  const [verifications, setVerifications] = useState<UserNationalId[]>([]);
  const [loading, setLoading] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<UserNationalId | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const data = await userNationalIdService.getPending();
      setVerifications(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch verifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleVerify = async (verification: UserNationalId) => {
    try {
      await userNationalIdService.verify(verification.id, { approved: true });
      toast({ title: 'Success', description: 'ID verified successfully' });
      fetchVerifications();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to verify ID',
        variant: 'destructive',
      });
    }
  };

  const handleRejectClick = (verification: UserNationalId) => {
    setSelectedVerification(verification);
    setRejectionReason('');
    setIsVerifyDialogOpen(true);
  };

  const handleReject = async () => {
    if (!selectedVerification) return;
    try {
      await userNationalIdService.reject(selectedVerification.id, {
        approved: false,
        rejectionReason,
      });
      toast({ title: 'Success', description: 'ID rejected successfully' });
      setIsVerifyDialogOpen(false);
      fetchVerifications();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject ID',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-primary/10 text-primary';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ID Verification</h1>
          <p className="text-muted-foreground mt-2">Manage national ID verifications</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>National ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No pending verifications
                    </TableCell>
                  </TableRow>
                ) : (
                  verifications.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell className="font-mono">
                        {verification.nationalIdNumber}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {verification.userId.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            verification.status
                          )}`}
                        >
                          {getStatusIcon(verification.status)}
                          {verification.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {format(new Date(verification.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        {verification.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerify(verification)}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRejectClick(verification)}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject ID Verification</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this ID verification
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                placeholder="Please provide a clear reason for rejection..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IDVerification;
