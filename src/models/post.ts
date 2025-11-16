export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  likesCount?: number;
  commentsCount?: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  categoryId?: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  categoryId?: string;
}
