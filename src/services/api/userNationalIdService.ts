import { apiClient } from './client';
import { UserNationalId, CreateUserNationalIdRequest, UpdateUserNationalIdRequest, VerifyNationalIdRequest } from '@/models/userNationalId';

export const userNationalIdService = {
  async getByUserId(userId: string): Promise<UserNationalId> {
    return apiClient.get<UserNationalId>(`/UserNationalId/user/${userId}`);
  },

  async getById(id: string): Promise<UserNationalId> {
    return apiClient.get<UserNationalId>(`/UserNationalId/${id}`);
  },

  async getPending(): Promise<UserNationalId[]> {
    return apiClient.get<UserNationalId[]>('/UserNationalId/pending');
  },

  async getVerificationStatus(userId: string): Promise<{ status: string }> {
    return apiClient.get<{ status: string }>(`/UserNationalId/verification-status/${userId}`);
  },

  async create(userId: string, data: CreateUserNationalIdRequest): Promise<UserNationalId> {
    return apiClient.post<UserNationalId>(`/UserNationalId/user/${userId}`, data);
  },

  async update(id: string, data: UpdateUserNationalIdRequest): Promise<UserNationalId> {
    return apiClient.put<UserNationalId>(`/UserNationalId/${id}`, data);
  },

  async verify(id: string, data: VerifyNationalIdRequest): Promise<void> {
    return apiClient.post<void>(`/UserNationalId/verify/${id}`, data);
  },

  async reject(id: string, data: VerifyNationalIdRequest): Promise<void> {
    return apiClient.post<void>(`/UserNationalId/reject/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/UserNationalId/${id}`);
  },
};
