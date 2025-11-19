import { apiClient } from './client';
import { Skill, CreateSkillRequest, UpdateSkillRequest } from '@/models/skill';

export const skillService = {
  getAll: async (): Promise<Skill[]> => {
    return apiClient.get<Skill[]>('/Skill');
  },

  getByUserId: async (userId: string): Promise<Skill[]> => {
    return apiClient.get<Skill[]>(`/Skill/user/${userId}`);
  },

  create: async (userId: string, data: CreateSkillRequest): Promise<Skill> => {
    return apiClient.post<Skill>(`/Skill/${userId}`, data);
  },

  update: async (skillId: string, data: UpdateSkillRequest): Promise<Skill> => {
    return apiClient.put<Skill>(`/Skill/${skillId}`, data);
  },

  delete: async (skillId: string): Promise<void> => {
    return apiClient.delete<void>(`/Skill/${skillId}`);
  },
};
