import { apiClient } from './client';
import { SocialMedia, CreateSocialMediaRequest, UpdateSocialMediaRequest } from '@/models/socialMedia';

export const socialMediaService = {
  async getAll(): Promise<SocialMedia[]> {
    return apiClient.get<SocialMedia[]>('/SocialMedia');
  },

  async getByUserId(userId: string): Promise<SocialMedia[]> {
    return apiClient.get<SocialMedia[]>(`/SocialMedia/user/${userId}`);
  },

  async create(data: CreateSocialMediaRequest): Promise<SocialMedia> {
    return apiClient.post<SocialMedia>('/SocialMedia', data);
  },

  async update(id: string, data: UpdateSocialMediaRequest): Promise<SocialMedia> {
    return apiClient.put<SocialMedia>(`/SocialMedia/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/SocialMedia/${id}`);
  },
};
