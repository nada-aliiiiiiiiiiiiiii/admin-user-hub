import { apiClient } from './client';
import { Certificate, CreateCertificateRequest, UpdateCertificateRequest } from '@/models/certificate';

export const certificateService = {
  getByUserId: async (userId: string): Promise<Certificate[]> => {
    return apiClient.get<Certificate[]>(`/Certifictes/user/${userId}`);
  },

  create: async (userId: string, data: CreateCertificateRequest): Promise<Certificate> => {
    return apiClient.post<Certificate>(`/Certifictes/user/${userId}`, data);
  },

  update: async (cerId: string, userId: string, data: UpdateCertificateRequest): Promise<Certificate> => {
    return apiClient.put<Certificate>(`/Certifictes/${cerId}/user/${userId}`, data);
  },

  delete: async (cerId: string, userId: string): Promise<void> => {
    return apiClient.delete<void>(`/Certifictes/${cerId}/user/${userId}`);
  },
};
