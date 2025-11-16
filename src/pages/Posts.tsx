import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Posts = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground mt-2">Manage all posts</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Posts management interface will be implemented here with full CRUD operations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Posts;
