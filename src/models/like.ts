export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface LikeResponse {
  success: boolean;
  likesCount: number;
}
