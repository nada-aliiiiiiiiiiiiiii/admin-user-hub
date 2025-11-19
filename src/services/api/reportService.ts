import { apiClient } from './client';
import { Report, CreateReportRequest } from '@/models/report';

export const reportService = {
  create: async (data: CreateReportRequest): Promise<Report> => {
    return apiClient.post<Report>('/Report', data);
  },

  getByUserId: async (userId: string): Promise<Report[]> => {
    return apiClient.get<Report[]>(`/Report/user/${userId}`);
  },
};
