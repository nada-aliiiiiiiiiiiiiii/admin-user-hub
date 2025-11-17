import { useState, useEffect } from 'react';
import { userNationalIdService } from '@/services/api/userNationalIdService';
import { authService } from '@/services/api/authService';
import { UserNationalId } from '@/models/userNationalId';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Clock, XCircle, Upload, IdCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function UserNationalID() {
  const [idInfo, setIdInfo] = useState<UserNationalId | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nationalIdNumber: '',
    frontImageUrl: '',
    backImageUrl: '',
  });
  const { toast } = useToast();
  const user = authService.getCurrentUser();

  const fetchIdInfo = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const status = await userNationalIdService.getVerificationStatus(user.id);
      setIdInfo(status as UserNationalId);
    } catch (error: any) {
      // No ID uploaded yet
      setIdInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdInfo();
  }, []);

  const handleSubmit = async () => {
    if (!user || !formData.nationalIdNumber.trim()) {
      toast({
        title: 'Validation Error',
        description: 'National ID number is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await userNationalIdService.create(user.id, formData);
      toast({
        title: 'Success',
        description: 'National ID submitted for verification',
      });
      fetchIdInfo();
      setUploadDialogOpen(false);
      setFormData({ nationalIdNumber: '', frontImageUrl: '', backImageUrl: '' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: UserNationalId['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-12 w-12 text-green-500" />;
      case 'pending':
        return <Clock className="h-12 w-12 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getStatusBadge = (status: UserNationalId['status']) => {
    const variants: Record<UserNationalId['status'], 'default' | 'secondary' | 'destructive'> = {
      verified: 'default',
      pending: 'secondary',
      rejected: 'destructive',
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">Loading verification status...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ID Verification</h1>
        <p className="text-muted-foreground">Verify your identity to access premium features</p>
      </div>

      {!idInfo ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <IdCard className="h-6 w-6 text-primary" />
              <CardTitle>Upload Your National ID</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              To verify your identity, please upload your national ID card. This helps us ensure
              the security of our platform.
            </p>
            <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload National ID
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Verification Status</CardTitle>
              {getStatusBadge(idInfo.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center py-6">
              {getStatusIcon(idInfo.status)}
              <h3 className="mt-4 text-xl font-semibold">
                {idInfo.status === 'verified' && 'Verified'}
                {idInfo.status === 'pending' && 'Pending Verification'}
                {idInfo.status === 'rejected' && 'Verification Rejected'}
              </h3>
              {idInfo.status === 'verified' && (
                <p className="text-muted-foreground text-center mt-2">
                  Your identity has been successfully verified
                </p>
              )}
              {idInfo.status === 'pending' && (
                <p className="text-muted-foreground text-center mt-2">
                  Your ID is being reviewed by our team. This usually takes 1-2 business days.
                </p>
              )}
              {idInfo.status === 'rejected' && idInfo.rejectionReason && (
                <div className="mt-4 p-4 bg-destructive/10 rounded-lg">
                  <p className="text-sm font-medium">Rejection Reason:</p>
                  <p className="text-sm text-muted-foreground mt-1">{idInfo.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID Number:</span>
                <span className="font-medium">{idInfo.nationalIdNumber}</span>
              </div>
              {idInfo.verifiedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Verified On:</span>
                  <span className="font-medium">
                    {new Date(idInfo.verifiedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {idInfo.status === 'rejected' && (
              <Button onClick={() => setUploadDialogOpen(true)} className="w-full gap-2">
                <Upload className="h-4 w-4" />
                Upload New ID
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload National ID</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="idNumber">National ID Number *</Label>
              <Input
                id="idNumber"
                value={formData.nationalIdNumber}
                onChange={(e) => setFormData({ ...formData, nationalIdNumber: e.target.value })}
                placeholder="Enter your national ID number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frontImage">Front Image URL (Optional)</Label>
              <Input
                id="frontImage"
                value={formData.frontImageUrl}
                onChange={(e) => setFormData({ ...formData, frontImageUrl: e.target.value })}
                placeholder="URL to front image of ID"
                type="url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backImage">Back Image URL (Optional)</Label>
              <Input
                id="backImage"
                value={formData.backImageUrl}
                onChange={(e) => setFormData({ ...formData, backImageUrl: e.target.value })}
                placeholder="URL to back image of ID"
                type="url"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Note: In a production app, you would upload actual image files. For this demo, please
              provide URLs to your ID images.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Submit for Verification</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
