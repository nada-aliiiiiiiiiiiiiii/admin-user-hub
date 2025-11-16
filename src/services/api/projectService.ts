import { apiClient } from './client';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '@/models/project';

export const projectService = {
  async getAll(): Promise<Project[]> {
    return apiClient.get<Project[]>('/Projects');
  },

  async getByUserId(userId: string): Promise<Project[]> {
    return apiClient.get<Project[]>(`/Projects/user/${userId}`);
  },

  async create(data: CreateProjectRequest): Promise<Project> {
    return apiClient.post<Project>('/Projects', data);
  },

  async update(id: string, data: UpdateProjectRequest): Promise<Project> {
    return apiClient.put<Project>(`/Projects/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/Projects/${id}`);
  },
};
