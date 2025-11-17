import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '@/services/api/postService';
import { authService } from '@/services/api/authService';
import { Post } from '@/models/post';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Heart, MessageSquare, Edit, Trash2, Plus } from 'lucide-react';
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

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const user = authService.getCurrentUser();

  const fetchMyPosts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await postService.getByUserId(user.id);
      setPosts(data);
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
    fetchMyPosts();
  }, []);

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      await postService.delete(postToDelete);
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
      setPosts(prev => prev.filter(p => p.id !== postToDelete));
      setDeleteDialogOpen(false);
      setPostToDelete(null);
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
        <div className="text-center">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Posts</h1>
          <p className="text-muted-foreground">Manage your posts</p>
        </div>
        <Link to="/user/create-post">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">You haven't created any posts yet</p>
              <Link to="/user/create-post">
                <Button>Create Your First Post</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <Link to={`/user/post/${post.id}`}>
                      <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/user/edit-post/${post.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPostToDelete(post.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{post.content}</p>
              </CardContent>
              <CardFooter className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>{post.likesCount || 0} likes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.commentsCount || 0} comments</span>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
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
