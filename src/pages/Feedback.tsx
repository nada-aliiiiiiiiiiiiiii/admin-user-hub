import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Star, Search, Trash2 } from 'lucide-react';
import { feedbackService } from '@/services/api/feedbackService';
import { UserSessionFeedback } from '@/models/feedback';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState<UserSessionFeedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<UserSessionFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<UserSessionFeedback | null>(null);
  const { toast } = useToast();

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await feedbackService.getAll();
      setFeedbacks(data);
      setFilteredFeedbacks(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch feedbacks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const filtered = feedbacks.filter(
      (feedback) =>
        feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFeedbacks(filtered);
  }, [searchTerm, feedbacks]);

  const handleDelete = (feedback: UserSessionFeedback) => {
    setSelectedFeedback(feedback);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedFeedback) return;
    try {
      await feedbackService.delete(selectedFeedback.id);
      toast({ title: 'Success', description: 'Feedback deleted successfully' });
      setIsDeleteDialogOpen(false);
      fetchFeedbacks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete feedback',
        variant: 'destructive',
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? 'fill-yellow-500 text-yellow-500'
                : 'fill-muted text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Session Feedback</h1>
          <p className="text-muted-foreground mt-2">User feedback and ratings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Feedback</CardTitle>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell className="font-mono text-sm">
                      {feedback.sessionId.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          feedback.role === 'teacher'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary/80 text-secondary-foreground'
                        }`}
                      >
                        {feedback.role}
                      </span>
                    </TableCell>
                    <TableCell>{renderStars(feedback.rating)}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {feedback.comment || '-'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(feedback.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(feedback)}
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Feedback</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
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

export default Feedback;
