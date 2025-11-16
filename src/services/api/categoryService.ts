import { apiClient } from './client';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/models/category';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return apiClient.get<Category[]>('/Category');
  },

  async getById(id: string): Promise<Category> {
    return apiClient.get<Category>(`/Category/${id}`);
  },

  async create(data: CreateCategoryRequest): Promise<Category> {
    return apiClient.post<Category>('/Category', data);
  },

  async update(id: string, data: UpdateCategoryRequest): Promise<Category> {
    return apiClient.put<Category>(`/Category/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/Category/${id}`);
  },
};
