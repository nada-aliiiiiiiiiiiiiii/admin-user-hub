import { useState, useEffect } from 'react';
import { socialMediaService } from '@/services/api/socialMediaService';
import { authService } from '@/services/api/authService';
import { SocialMedia } from '@/models/socialMedia';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

export default function UserSocialMedia() {
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<SocialMedia | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    username: '',
  });
  const { toast } = useToast();
  const user = authService.getCurrentUser();

  const fetchSocialMedia = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await socialMediaService.getByUserId(user.id);
      setSocialLinks(data);
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
    fetchSocialMedia();
  }, []);

  const handleCreate = () => {
    setSelectedLink(null);
    setFormData({ platform: '', url: '', username: '' });
    setDialogOpen(true);
  };

  const handleEdit = (link: SocialMedia) => {
    setSelectedLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      username: link.username || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.platform.trim() || !formData.url.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Platform and URL are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (selectedLink) {
        await socialMediaService.update(selectedLink.id, formData);
        toast({ title: 'Success', description: 'Social media link updated successfully' });
      } else {
        await socialMediaService.create(formData);
        toast({ title: 'Success', description: 'Social media link added successfully' });
      }
      fetchSocialMedia();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!linkToDelete) return;

    try {
      await socialMediaService.delete(linkToDelete);
      toast({ title: 'Success', description: 'Social media link deleted successfully' });
      setSocialLinks(prev => prev.filter(l => l.id !== linkToDelete));
      setDeleteDialogOpen(false);
      setLinkToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">Loading social media links...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Media</h1>
          <p className="text-muted-foreground">Manage your social media profiles</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Social Link
        </Button>
      </div>

      {socialLinks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">No social media links yet</p>
            <Button onClick={handleCreate}>Add Your First Link</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {socialLinks.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{link.platform}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(link)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLinkToDelete(link.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {link.username && (
                  <p className="text-sm text-muted-foreground">@{link.username}</p>
                )}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Profile
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedLink ? 'Edit Social Link' : 'Add Social Link'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              <Input
                id="platform"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                placeholder="e.g., Twitter, LinkedIn, Instagram"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="@username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                type="url"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {selectedLink ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Social Link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this social media link? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
