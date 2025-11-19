import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { certificateService } from '@/services/api/certificateService';
import { Certificate, CreateCertificateRequest } from '@/models/certificate';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Award, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';

const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuedBy: z.string().min(1, 'Issuer is required'),
  issuedDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional(),
  description: z.string().optional(),
  certificateUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  credentialId: z.string().optional(),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

export default function UserCertificates() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: '',
      issuedBy: '',
      issuedDate: '',
      expiryDate: '',
      description: '',
      certificateUrl: '',
      credentialId: '',
    },
  });

  const { data: certificates, isLoading } = useQuery({
    queryKey: ['certificates', user?.id],
    queryFn: () => certificateService.getByUserId(user!.id),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCertificateRequest) =>
      certificateService.create(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast({ title: 'Certificate added successfully' });
      setDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Failed to add certificate', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      certificateService.update(id, user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast({ title: 'Certificate updated successfully' });
      setDialogOpen(false);
      setEditingCert(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Failed to update certificate', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => certificateService.delete(id, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast({ title: 'Certificate deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete certificate', variant: 'destructive' });
    },
  });

  const handleOpenDialog = (cert?: Certificate) => {
    if (cert) {
      setEditingCert(cert);
      form.reset({
        title: cert.title,
        issuedBy: cert.issuedBy,
        issuedDate: cert.issuedDate.split('T')[0],
        expiryDate: cert.expiryDate?.split('T')[0] || '',
        description: cert.description || '',
        certificateUrl: cert.certificateUrl || '',
        credentialId: cert.credentialId || '',
      });
    } else {
      setEditingCert(null);
      form.reset();
    }
    setDialogOpen(true);
  };

  const onSubmit = (data: CertificateFormData) => {
    if (editingCert) {
      updateMutation.mutate({ id: editingCert.id, data });
    } else {
      createMutation.mutate(data as CreateCertificateRequest);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading certificates...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Certificates</h1>
          <p className="text-muted-foreground">Manage your professional certifications</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Certificate
        </Button>
      </div>

      {!certificates?.length ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No certificates yet</p>
            <Button onClick={() => handleOpenDialog()}>Add Your First Certificate</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Award className="w-8 h-8 text-primary" />
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(cert)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cert.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle>{cert.title}</CardTitle>
                <CardDescription>{cert.issuedBy}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Issued: </span>
                  {new Date(cert.issuedDate).toLocaleDateString()}
                </div>
                {cert.expiryDate && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Expires: </span>
                    {new Date(cert.expiryDate).toLocaleDateString()}
                  </div>
                )}
                {cert.credentialId && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Credential ID: </span>
                    {cert.credentialId}
                  </div>
                )}
                {cert.description && (
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                )}
                {cert.certificateUrl && (
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    View Certificate
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCert ? 'Edit Certificate' : 'Add Certificate'}
            </DialogTitle>
            <DialogDescription>
              {editingCert
                ? 'Update your certificate information'
                : 'Add a new professional certification'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="AWS Certified Solutions Architect" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issuedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issued By *</FormLabel>
                    <FormControl>
                      <Input placeholder="Amazon Web Services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="issuedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="credentialId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credential ID</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC123XYZ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="certificateUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingCert ? 'Update' : 'Add'} Certificate
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
