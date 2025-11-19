import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminReportService } from '@/services/api/adminReportService';
import { AdminReport } from '@/models/adminReport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';

export default function AdminReports() {
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allReports, isLoading } = useQuery({
    queryKey: ['adminReports'],
    queryFn: adminReportService.getAll,
  });

  const { data: pendingReports } = useQuery({
    queryKey: ['adminReports', 'pending'],
    queryFn: adminReportService.getPending,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) =>
      adminReportService.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
      toast({ title: 'Status updated successfully' });
      setStatusDialogOpen(false);
      setSelectedReport(null);
    },
    onError: () => {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminReportService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
      toast({ title: 'Report deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete report', variant: 'destructive' });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { icon: Clock, variant: 'secondary' },
      reviewed: { icon: AlertCircle, variant: 'default' },
      resolved: { icon: CheckCircle, variant: 'default' },
      rejected: { icon: XCircle, variant: 'destructive' },
    };
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const handleUpdateStatus = (report: AdminReport) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setStatusDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      deleteMutation.mutate(id);
    }
  };

  const ReportsTable = ({ reports }: { reports: AdminReport[] | undefined }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reported By</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports?.map((report) => (
          <TableRow key={report.id}>
            <TableCell>{report.reportedByName || 'Unknown'}</TableCell>
            <TableCell className="font-medium">{report.reportType}</TableCell>
            <TableCell className="max-w-md truncate">{report.description}</TableCell>
            <TableCell>{getStatusBadge(report.status)}</TableCell>
            <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(report)}>
                  Update Status
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(report.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {!reports?.length && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No reports found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  if (isLoading) {
    return <div className="p-8 text-center">Loading reports...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Reports</h1>
        <p className="text-muted-foreground">Manage user reports and violations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allReports?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allReports?.filter((r) => r.status === 'resolved').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allReports?.filter((r) => r.status === 'rejected').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>View and manage all user reports</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportsTable reports={allReports} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>Reports awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportsTable reports={pendingReports} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Report Status</DialogTitle>
            <DialogDescription>
              Change the status of this report
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedReport) {
                  updateStatusMutation.mutate({
                    id: selectedReport.id,
                    status: newStatus,
                  });
                }
              }}
              disabled={updateStatusMutation.isPending}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
