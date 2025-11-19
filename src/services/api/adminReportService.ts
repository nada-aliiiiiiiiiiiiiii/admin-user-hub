import { apiClient } from './client';
import { AdminReport, UpdateReportStatusRequest } from '@/models/adminReport';

export const adminReportService = {
  getAll: async (): Promise<AdminReport[]> => {
    return apiClient.get<AdminReport[]>('/admin/reports');
  },

  getPending: async (): Promise<AdminReport[]> => {
    return apiClient.get<AdminReport[]>('/admin/reports/pending');
  },

  updateStatus: async (id: string, data: UpdateReportStatusRequest): Promise<AdminReport> => {
    return apiClient.put<AdminReport>(`/admin/reports/${id}/status`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/admin/reports/${id}`);
  },
};
