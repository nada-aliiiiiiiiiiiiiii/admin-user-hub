import { apiClient } from './client';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '@/models/comment';

export const commentService = {
  async getAll(): Promise<Comment[]> {
    return apiClient.get<Comment[]>('/Comments');
  },

  async getById(id: string): Promise<Comment> {
    return apiClient.get<Comment>(`/Comments/${id}`);
  },

  async getByPostId(postId: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/posts/${postId}/comments`);
  },

  async create(postId: string, data: CreateCommentRequest): Promise<Comment> {
    return apiClient.post<Comment>(`/posts/${postId}/comments`, data);
  },

  async update(id: string, data: UpdateCommentRequest): Promise<Comment> {
    return apiClient.put<Comment>(`/Comments/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/Comments/${id}`);
  },
};
