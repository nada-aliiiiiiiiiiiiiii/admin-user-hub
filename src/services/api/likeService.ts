import { apiClient } from './client';
import { Like, LikeResponse } from '@/models/like';

export const likeService = {
  async like(postId: string): Promise<LikeResponse> {
    return apiClient.post<LikeResponse>(`/posts/${postId}/like`);
  },

  async unlike(postId: string): Promise<LikeResponse> {
    return apiClient.delete<LikeResponse>(`/posts/${postId}/like`);
  },

  async getCount(postId: string): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>(`/posts/${postId}/likes/count`);
  },

  async isLiked(postId: string, userId: string): Promise<{ isLiked: boolean }> {
    return apiClient.get<{ isLiked: boolean }>(`/posts/${postId}/isLiked/${userId}`);
  },

  async getLikes(postId: string): Promise<Like[]> {
    return apiClient.get<Like[]>(`/posts/${postId}/likes`);
  },
};
