import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { socialMediaService } from '@/services/api/socialMediaService';
import { SocialMedia, CreateSocialMediaRequest, UpdateSocialMediaRequest } from '@/models/socialMedia';
import { useToast } from '@/hooks/use-toast';

const SocialMediaPage = () => {
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSocialMedia, setSelectedSocialMedia] = useState<SocialMedia | null>(null);
  const [formData, setFormData] = useState<CreateSocialMediaRequest>({
    platform: '',
    url: '',
    username: '',
  });
  const { toast } = useToast();

  const fetchSocialMedias = async () => {
    try {
      setLoading(true);
      const data = await socialMediaService.getAll();
      setSocialMedias(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch social media links',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialMedias();
  }, []);

  const handleCreate = () => {
    setSelectedSocialMedia(null);
    setFormData({ platform: '', url: '', username: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (sm: SocialMedia) => {
    setSelectedSocialMedia(sm);
    setFormData({
      platform: sm.platform,
      url: sm.url,
      username: sm.username || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (sm: SocialMedia) => {
    setSelectedSocialMedia(sm);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedSocialMedia) {
        await socialMediaService.update(selectedSocialMedia.id, formData as UpdateSocialMediaRequest);
        toast({ title: 'Success', description: 'Social media link updated successfully' });
      } else {
        await socialMediaService.create(formData);
        toast({ title: 'Success', description: 'Social media link created successfully' });
      }
      setIsDialogOpen(false);
      fetchSocialMedias();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Operation failed',
        variant: 'destructive',
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedSocialMedia) return;
    try {
      await socialMediaService.delete(selectedSocialMedia.id);
      toast({ title: 'Success', description: 'Social media link deleted successfully' });
      setIsDeleteDialogOpen(false);
      fetchSocialMedias();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete social media link',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Social Media</h1>
          <p className="text-muted-foreground mt-2">Manage social media links</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Social Media Links</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socialMedias.map((sm) => (
                  <TableRow key={sm.id}>
                    <TableCell className="font-medium">{sm.platform}</TableCell>
                    <TableCell>{sm.username || '-'}</TableCell>
                    <TableCell className="max-w-md truncate">
                      <a href={sm.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {sm.url}
                      </a>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(sm)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(sm)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSocialMedia ? 'Edit Social Media Link' : 'Add Social Media Link'}
            </DialogTitle>
            <DialogDescription>
              {selectedSocialMedia ? 'Update link details' : 'Add a new social media link'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                placeholder="e.g. Facebook, Twitter, Instagram"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="username">Username (optional)</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {selectedSocialMedia ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Social Media Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this link? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialMediaPage;
