import { apiClient } from './client';
import { Material, CreateMaterialRequest, UpdateMaterialRequest } from '@/models/material';

export const materialService = {
  async getAll(): Promise<Material[]> {
    return apiClient.get<Material[]>('/Materials');
  },

  async getById(id: string): Promise<Material> {
    return apiClient.get<Material>(`/Materials/${id}`);
  },

  async create(data: CreateMaterialRequest): Promise<Material> {
    return apiClient.post<Material>('/Materials', data);
  },

  async update(id: string, data: UpdateMaterialRequest): Promise<Material> {
    return apiClient.put<Material>(`/Materials/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/Materials/${id}`);
  },
};
