import { apiClient } from './client';
import { Post, CreatePostRequest, UpdatePostRequest } from '@/models/post';
import { PaginatedResponse } from '@/models/common';

export const postService = {
  async getAll(page = 1, pageSize = 10, search = ''): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(search && { search }),
    });
    return apiClient.get<PaginatedResponse<Post>>(`/Post?${params}`);
  },

  async getById(id: string): Promise<Post> {
    return apiClient.get<Post>(`/Post/${id}`);
  },

  async getByUserId(userId: string): Promise<Post[]> {
    return apiClient.get<Post[]>(`/Post/user/${userId}`);
  },

  async create(data: CreatePostRequest): Promise<Post> {
    return apiClient.post<Post>('/Post', data);
  },

  async update(id: string, data: UpdatePostRequest): Promise<Post> {
    return apiClient.put<Post>(`/Post/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/Post/${id}`);
  },
};
