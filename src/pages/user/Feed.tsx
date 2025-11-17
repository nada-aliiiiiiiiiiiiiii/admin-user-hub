import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '@/services/api/postService';
import { likeService } from '@/services/api/likeService';
import { authService } from '@/services/api/authService';
import { Post } from '@/models/post';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Heart, MessageSquare, Search, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const user = authService.getCurrentUser();
  const itemsPerPage = 10;

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAll(currentPage, itemsPerPage, searchTerm);
      setPosts(response.data);
      setTotalPages(response.totalPages);

      // Check which posts are liked by current user
      if (user) {
        const likedSet = new Set<string>();
        for (const post of response.data) {
          try {
            const isLiked = await likeService.isLiked(post.id, user.id);
            if (isLiked) {
              likedSet.add(post.id);
            }
          } catch (error) {
            // Ignore errors for individual posts
          }
        }
        setLikedPosts(likedSet);
      }
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
    fetchPosts();
  }, [currentPage, searchTerm]);

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const isLiked = likedPosts.has(postId);
      
      if (isLiked) {
        await likeService.unlike(postId);
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        await likeService.like(postId);
        setLikedPosts(prev => new Set(prev).add(postId));
      }

      // Update the post's like count
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, likesCount: (p.likesCount || 0) + (isLiked ? -1 : 1) }
            : p
        )
      );
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
          <h1 className="text-3xl font-bold tracking-tight">Feed</h1>
          <p className="text-muted-foreground">Discover and interact with posts</p>
        </div>
        <Link to="/user/create-post">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No posts found
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Link to={`/user/post/${post.id}`}>
                      <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{post.content}</p>
              </CardContent>
              <CardFooter className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleLike(post.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  <span>{post.likesCount || 0}</span>
                </Button>
                <Link to={`/user/post/${post.id}`}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.commentsCount || 0}</span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={
                  currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
