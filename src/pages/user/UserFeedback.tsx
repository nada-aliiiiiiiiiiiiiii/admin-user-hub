import { useState, useEffect } from 'react';
import { feedbackService } from '@/services/api/feedbackService';
import { authService } from '@/services/api/authService';
import { UserSessionFeedback } from '@/models/feedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, Plus, Edit, Trash2 } from 'lucide-react';
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

export default function UserFeedback() {
  const [feedbacks, setFeedbacks] = useState<UserSessionFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<UserSessionFeedback | null>(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sessionId: '',
    rating: 5,
    comment: '',
    role: 'student' as 'teacher' | 'student',
  });
  const { toast } = useToast();
  const user = authService.getCurrentUser();

  const fetchFeedbacks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await feedbackService.getByUserId(user.id);
      setFeedbacks(data);
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
    fetchFeedbacks();
  }, []);

  const handleCreate = () => {
    setSelectedFeedback(null);
    setFormData({ sessionId: '', rating: 5, comment: '', role: 'student' });
    setDialogOpen(true);
  };

  const handleEdit = (feedback: UserSessionFeedback) => {
    setSelectedFeedback(feedback);
    setFormData({
      sessionId: feedback.sessionId,
      rating: feedback.rating,
      comment: feedback.comment || '',
      role: feedback.role,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.sessionId.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Session ID is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (selectedFeedback) {
        await feedbackService.update(selectedFeedback.id, {
          rating: formData.rating,
          comment: formData.comment,
        });
        toast({ title: 'Success', description: 'Feedback updated successfully' });
      } else {
        await feedbackService.create(formData);
        toast({ title: 'Success', description: 'Feedback submitted successfully' });
      }
      fetchFeedbacks();
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
    if (!feedbackToDelete) return;

    try {
      await feedbackService.delete(feedbackToDelete);
      toast({ title: 'Success', description: 'Feedback deleted successfully' });
      setFeedbacks(prev => prev.filter(f => f.id !== feedbackToDelete));
      setDeleteDialogOpen(false);
      setFeedbackToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">Loading feedback...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Session Feedback</h1>
          <p className="text-muted-foreground">Manage your session feedback</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Feedback
        </Button>
      </div>

      {feedbacks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">No feedback yet</p>
            <Button onClick={handleCreate}>Submit Your First Feedback</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">Session: {feedback.sessionId}</CardTitle>
                      <Badge variant="outline">{feedback.role}</Badge>
                    </div>
                    {renderStars(feedback.rating)}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(feedback)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFeedbackToDelete(feedback.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {feedback.comment && (
                  <p className="text-muted-foreground">{feedback.comment}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedFeedback ? 'Edit Feedback' : 'Add Feedback'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!selectedFeedback && (
              <div className="space-y-2">
                <Label htmlFor="sessionId">Session ID *</Label>
                <Input
                  id="sessionId"
                  value={formData.sessionId}
                  onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
                  placeholder="Enter session ID"
                />
              </div>
            )}
            {!selectedFeedback && (
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="rating">Rating *</Label>
              <Select
                value={formData.rating.toString()}
                onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} {rating === 1 ? 'Star' : 'Stars'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Share your feedback..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {selectedFeedback ? 'Update' : 'Submit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
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
